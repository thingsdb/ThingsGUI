import io from 'socket.io-client';
import moment from 'moment';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import {ErrorActions} from './ErrorStore';
import {LoginTAG} from '../Constants/Tags';


const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    pingInterval: 10000,
    reconnectionAttempts: Infinity,
    transports: ['websocket'],
});

class _SocketRequest {

    _doneCb() {
    }

    _failCb(event, status, message) {
        window.console.error(event, status, message);
    }

    _alwaysCb() {
    }

    constructor(event, ...data) {
        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within 3 seconds.`);
        }, 3000);
        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);

            this._alwaysCb(status, data);
            if (status === 200) {
                this._doneCb(data);
            } else if (status === 204) {
                this._doneCb({ result: 'success (204)' });
            } else {
                this._failCb(event, status, message);
            }
        });
    }

    done(doneCb) {
        this._doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this._failCb = failCb;
        return this;
    }

    always(alwaysCb) {
        this._alwaysCb = alwaysCb;
        return this;
    }
}

class _BlobRequest {

    constructor(type, url, data) {

        this.doneCb = function (data) { };          // eslint-disable-line
        this.failCb = function (xhr, data) { };   // eslint-disable-line

        var textFile = null;
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'blob';

        xhr.onreadystatechange = () => {
            if (xhr.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status == 200) {
                const blob = new Blob([xhr.response], {type: 'application/octet-stream'});
                // If we are replacing a previously generated file we need to
                // manually revoke the object URL to avoid memory leaks.
                if (textFile !== null) {
                    window.URL.revokeObjectURL(textFile);
                }
                textFile = window.URL.createObjectURL(blob);
                this.doneCb(textFile);
            } else {
                let rsp;
                try {
                    const blob = new Blob([xhr.response], {type: 'text/plain'});
                    const reader = new FileReader();

                    // This fires after the blob has been read/loaded.
                    reader.addEventListener('loadend', (e) => {
                        rsp = e.srcElement.result;
                        this.failCb(xhr, rsp);
                    });

                    // Start reading the blob as text.
                    reader.readAsText(blob);
                } catch (e) {
                    this.failCb(xhr, null);
                }

            }
        };

        xhr.send((!data) ? null : JSON.stringify(data));
    }

    done(doneCb) {
        this.doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this.failCb = failCb;
        return this;
    }
}

class _JsonRequest {

    constructor(type, url, data, isStringified) {

        this.doneCb = function (data) { };         // eslint-disable-line
        this.failCb = function (error, msg) {
            console.error(error, msg || 'Unknown error occurred');
        };
        this.alwaysCb = function (xhr, data) { };  // eslint-disable-line

        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/json');

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            let data;

            if (xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                this.doneCb(data);
            } else if (xhr.status === 204) {
                this.doneCb({ result: 'success (204)' });
            } else {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    data = xhr.responseText;
                }
                this.failCb(xhr, data);
            }
            this.alwaysCb(xhr, data);
        };

        xhr.send((data === undefined || isStringified) ?
            data : JSON.stringify(data));
    }

    done(doneCb) {
        this.doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this.failCb = failCb;
        return this;
    }

    always(alwaysCb) {
        this.alwaysCb = alwaysCb;
        return this;
    }
}


class BaseStore extends Vlow.Store {

    emit(name, data) {
        return new _SocketRequest(name, data);
    }

    post(url, data) {
        return new _BlobRequest('POST', url, data);
    }

    get(url) {
        return new _JsonRequest('GET', url);
    }
}

const EventActions = Vlow.createActions([
    'join',
    'leave',
    'rejoin',
    'reset',
]);

class EventStore extends BaseStore {

    static types = {
        events: PropTypes.object,
        ids: PropTypes.object,
    }

    static defaults = {
        events: {},
        ids: {},
    }

    constructor() {
        super(EventActions);
        this.state = EventStore.defaults;

        socket.on('onLogging', (msg) => {
            window.console.log(msg);

            if(msg.includes('connection lost')) {
                ErrorActions.setMsgError(LoginTAG, msg);
            } else if(msg.includes('[W]') || msg.includes('[E]')) {
                ErrorActions.setToastError(msg.slice(4));
            }
        });

        socket.on('disconnect', () => {
            location.reload();
        });


        // Room events

        socket.on('onInit', (data) => {
            console.log('onInit', data);
        });

        socket.on('onJoin', (roomId) => {
            this.setState(prevState => {
                let ids = {...prevState.ids, [roomId]: true};
                return {ids: ids};
            });
        });

        socket.on('onLeave', (roomId) => {
            this.setState(prevState => {
                let ids = prevState.ids;
                delete ids[roomId];
                return {ids: ids};
            });
        });

        socket.on('onDelete', (roomId) => {
            this.setState(prevState => {
                let ids = prevState.ids;
                let events = prevState.events;
                delete ids[roomId];
                delete events[roomId];
                return {ids: ids, events: events};
            });
        });

        socket.on('onEvent', (roomId, eventId, event, args) => {
            this.setState(prevState => {
                let events = prevState.events;
                let time = moment().format('YYYY-MM-DD HH:mm');

                let json = JSON.stringify(args);
                let unquoted = json.replace(/"([^"]+)":/g, '$1:');
                let evt = {eventId, event, args, stringArgs: unquoted, receivedAt: time};
                let updatedEvent = events[roomId] ? [...events[roomId], evt] : [evt];
                return {events: {...events, [roomId]: updatedEvent}};
            });
        });
    }

    onJoin(scope, id='', tag=null) {
        this.emit('join', {
            scope,
            id: id,
            wait: 0
        }).done(() => null).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    onLeave(id, tag=null) {
        this.emit('leave', {
            id: id
        }).done(() => null).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    onRejoin() {
        const {ids} = this.state;
        Object.entries(ids).forEach(([id, scope]) => {
            this.onJoin(scope, id);
        });
    }

    onReset() {
        this.setState({
            events: {},
            ids: {},
        });
    }
}

export {BaseStore, EventActions, EventStore};