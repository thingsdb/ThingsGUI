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

        socket.emit('log');
        socket.on('logging', (msg) => {
            window.console.log(msg);
            if (msg.includes('connection lost')) {
                ErrorActions.setMsgError('0', msg);
            }
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
    'resetWatch',
]);

const ProtoMap = {
    ProtoOnWatchIni: 1,
    ProtoOnWatchUpd: 2,
    ProtoOnWatchDel: 3,
    ProtoOnNodeStatus: 0,
    ProtoOnWarn: 4,
};

class EventStore extends BaseStore {

    static types = {
        watchIds: PropTypes.object,
        watchProcedures: PropTypes.object,
        watchThings: PropTypes.object,
        watchTypes: PropTypes.object,
    }

    static defaults = {
        watchIds: {},
        watchProcedures: {},
        watchThings: {},
        watchTypes: {},
    }

    constructor() {
        super(EventActions);
        this.state = EventStore.defaults;
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
            case ProtoMap.ProtoOnNodeStatus:
                console.log(data.Data);
                this.nodeStatus(data.Data);
                break;
            case ProtoMap.ProtoOnWarn:
                ErrorActions.setMsgError('26', data.Data.warn_msg);
                break;
            default:

            }
        });
    }

    watchInit(data) {
        const {watchIds} = this.state;
        let scope;
        Object.entries(watchIds).map(
            ([k, v]) =>  {
                if(v.includes(`${data.thing['#']}`)){
                    scope = k;
                }
            }
        );

        this.setState(prevState => {
            const wt = Object.assign({}, prevState.watchThings[scope], {[data.thing['#']]: data.thing});
            const watchThings = Object.assign({}, prevState.watchThings, {[scope]: wt});

            let res = {watchThings: watchThings};

            if (data.procedures) {
                let proc = data.procedures.reduce((res, item) => { res[item.name] = item; return res;}, {});
                let typ = data.types.reduce((res, item) => { res[item.name] = item; return res;}, {});

                const pt = Object.assign({}, prevState.watchProcedures[scope], {[data.thing['#']]: proc});
                const watchProcedures = Object.assign({}, prevState.watchProcedures, {[scope]: pt});

                const tt = Object.assign({}, prevState.watchTypes[scope], {[data.thing['#']]: typ});
                const watchTypes = Object.assign({}, prevState.watchTypes, {[scope]: tt});

                res['watchProcedures'] = watchProcedures;
                res['watchTypes'] = watchTypes;
            }

            return res;
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
            case data.jobs[i].hasOwnProperty('new_procedure'):
                break;
            case data.jobs[i].hasOwnProperty('del_procedure'):
                break;
            case data.jobs[i].hasOwnProperty('mod_type_add'):
                break;
            case data.jobs[i].hasOwnProperty('mod_type_mod'):
                break;
            case data.jobs[i].hasOwnProperty('mod_type_del'):
                break;
            case data.jobs[i].hasOwnProperty('new_type'):
                break;
            case data.jobs[i].hasOwnProperty('set_type'):
                break;
            case data.jobs[i].hasOwnProperty('del_type'):
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
        const deleteCount = splice[prop][1];
        const length = splice[prop].length;
        this.setState(prevState => {
            const copyArr = [...prevState.watchThings[id][prop]];

            if (length>2) {
                copyArr.splice(index, deleteCount, ...splice[prop].slice(2));
            } else {
                copyArr.splice(index, deleteCount);
            }

            const update = Object.assign({}, prevState.watchThings[id], {[prop]: copyArr});
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
            return {watchThings};
        });

    }

    add(id, add) {
        const prop = Object.keys(add);
        this.setState(prevState => {
            const copySet = new Set([...prevState.watchThings[id][prop]['$']]);
            for (let i = 0; i<add[prop].length; i++ ) {
                copySet.add(add[prop][i]);
            }
            const newSet = {'$': [...copySet]};
            const update = Object.assign({}, prevState.watchThings[id], {[prop]: newSet});
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
            return {watchThings};
        });
    }

    remove(id, remove) {
        const prop = Object.keys(remove);
        this.setState(prevState => {
            const copySet = new Set([...prevState.watchThings[id][prop]['$']]);
            for (let i = 0; i<remove[prop].length; i++ ) {
                copySet.forEach(function(t){
                    if (t['#'] == remove[prop][i]) {
                        copySet.delete(t);
                    }
                });
            }
            const newSet = {'$': [...copySet]};
            const update = Object.assign({}, prevState.watchThings[id], {[prop]: newSet});
            const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
            return {watchThings};
        });
    }

    watchDel(data) {
        this.setState(prevState => {
            let copyState = JSON.parse(JSON.stringify(prevState.watchThings));
            delete copyState[data['#']];
            return {watchThings: copyState};
        });
    }

    nodeStatus(data) {
        // this.setState(prevState => {
        //     const update = Object.assign({}, prevState.watchThings[data['#']], set);
        //     const watchThings = Object.assign({}, prevState.watchThings, {[id]: update});
        //     return {watchThings};
        // });
    }

    onWatch(scope, id, tag=null) {
        console.log(scope);
        const idString = `${id}`;
        this.emit('watch', {
            scope,
            ids: [idString]
        }).done(() => {
            this.setState(prevState => {
                let copyState = prevState.watchIds.hasOwnProperty(scope) ? new Set([...prevState.watchIds[scope]])
                    : new Set();
                copyState.add(idString);
                const update = Object.assign({}, prevState.watchIds, {[scope]: [...copyState]});
                return {watchIds: update};
            });
        }).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    onUnwatch(scope, id, tag=null) {
        const idString = `${id}`;
        this.emit('unwatch', {
            scope,
            ids: [idString]
        }).done(() => {
            this.setState(prevState => {

                let copyThings = JSON.parse(JSON.stringify(prevState.watchThings));
                Object.keys(copyThings[scope]).length<2 ? delete copyThings[scope] : delete copyThings[scope][id];

                let copyIds = new Set([...prevState.watchIds[scope]]);
                copyIds.delete(idString);
                const update = Object.assign({}, prevState.watchIds, {[scope]: [...copyIds]});

                let res = {watchThings: copyThings, watchIds: update};

                let copyProcedures = JSON.parse(JSON.stringify(prevState.watchProcedures));
                if (copyProcedures[scope]) {
                    Object.keys(copyProcedures[scope]).length<2? delete copyProcedures[scope] : delete copyProcedures[scope][id];

                    let copyTypes = JSON.parse(JSON.stringify(prevState.watchTypes));
                    Object.keys(copyTypes[scope]).length<2? delete copyTypes[scope] : delete copyTypes[scope][id];

                    res['watchProcedures'] = copyProcedures;
                    res['watchTypes'] = copyTypes;
                }
                return res;
            });
        }).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    onResetWatch() {
        this.setState({
            watchThings: {},
            watchIds: {}
        });
    }
}

export {BaseStore, EventActions, EventStore};