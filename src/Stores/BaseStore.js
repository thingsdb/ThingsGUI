/* global process */

import Vlow from 'vlow';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import {ErrorActions} from './ErrorStore';

const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket']
});

class _SocketRequest {

    _doneCb() {
    }

    _failCb(event, status, message) {
        window.console.error(event, status, message);
    }

    _alwaysCb() {
    }

    // _triggerSessionError() {
    //     setTimeout(() => {
    //         location.reload();
    //     }, 3000);
    // }

    constructor(event, ...data) {
        window.console.debug(`Socket request: "${event}"`, data);

        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within 3 seconds.`);
        }, 3000);
        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);
            if (message !== undefined && message !== null) {
                // MessageActions.add(message);
            }

            this._alwaysCb(status, data);
            if (status === 200) {
                window.console.debug(`Socket response ("${event}"):`, data);
                this._doneCb(data);
            } else if (status === 125) {
                // this._triggerSessionError();
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

class _PushNotification {

    constructor() {

        socket.emit('log', 'hoi');
        socket.on('logging', (msg) => {
            window.console.log(msg);
        });
        socket.on('disconnect', () => {
            location.reload();
        });
    }
}


class BaseStore extends Vlow.Store {

    emit(name, data) {
        return new _SocketRequest(name, data);
    }

    post(url, data) {
        return new _BlobRequest('POST', url, data);
    }

    push() {
        return new _PushNotification();
    }
}

const EventActions = Vlow.createActions([
    'watch',
    'unwatch',
]);

const ProtoMap = {
    ProtoOnWatchIni: 16,
    ProtoOnWatchUpd: 17,
    ProtoOnWatchDel: 18,
    ProtoOnNodeStatus: 19,
    ProtoOnWarn: 20,
};

class EventStore extends BaseStore {

    static types = {
        watchThings: PropTypes.object,
    }

    constructor() {
        super(EventActions);
        this.state = {
            watchThings: {},
        };
        socket.emit('getEvent', 'hoi');
        socket.on('event', (data) => {
            window.console.log(data);
            switch(data.Proto){
            case ProtoMap.ProtoOnWatchIni:
                this.watchInit(data.Data);
                break;
            case ProtoMap.ProtoOnWatchUpd:
                this.watchUpdate(data.Data);
                break;
            case ProtoMap.ProtoOnWatchDel:
                this.watchDel(data.Data);
                break;
            default:

            }
        });
    }

    watchInit(data) {
        this.setState(prevState => {
            const watchThings = Object.assign({}, prevState.watchThings, {[data.thing['#']]: data.thing});
            return {watchThings};
        });
    }

    watchUpdate(data) {
        for (let i = 0; i<data.jobs.length; i++) {
            switch(true){
            case data.jobs[i].hasOwnProperty('set'):
                this.set(data['#'], data.jobs[i].set);
                break;
            case data.jobs[i].hasOwnProperty('del'):
                this.del(data['#'], data.jobs[i].del);
                break;
            case data.jobs[i].hasOwnProperty('splice'):
                this.splice(data['#'], data.jobs[i].splice);
                break;
            case data.jobs[i].hasOwnProperty('add'):
                this.add(data['#'], data.jobs[i].add);
                break;
            case data.jobs[i].hasOwnProperty('remove'):
                this.remove(data['#'], data.jobs[i].remove);
                break;
            default:

            }
        }
    }

    set(id, set) {
        this.setState(prevState => {
            const update = Object.assign({}, prevState.watchThings[id], set);
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
            return {watchThings};
        });
    }

    del(id, del) {
        this.setState(prevState => {
            let copyState = JSON.parse(JSON.stringify(prevState.watchThings[id]));
            delete copyState[del];
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: copyState});
            return {watchThings};
        });
    }

    splice(id, splice) {
        const prop = Object.keys(splice)[0];
        const index = splice[prop][0];
        const replace = splice[prop][1];
        const amount = splice[prop][2];

        this.setState(prevState => {
            const copyArr = [...prevState.watchThings[id]];
            if (amount) {
                copyArr.splice(index, replace, ...splice[prop].slice(3));
            } else {
                copyArr.splice(index, replace);
            }

            const update = Object.assign({}, prevState.watchThings[id], {[prop]: copyArr});
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
            return {watchThings};
        });

    }

    add() {
        //add
    }

    remove() {
        //remove
    }

    onWatch(scope, ids) {
        this.emit('watch', {
            scope,
            ids
        }).done(() => {
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onUnwatch(scope, ids) {
        this.emit('unwatch', {
            scope,
            ids
        }).done((data) => {
            console.log(data);
        }).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log);
        });
    }
}

export {BaseStore, EventActions, EventStore};