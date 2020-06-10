import Vlow from 'vlow';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import {ErrorActions} from './ErrorStore';
import {ApplicationActions} from './ApplicationStore';
import {LoginTAG, WatcherTAG} from '../constants';

const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    pingInterval: 10000,
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
        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within 3 seconds.`);
        }, 3000);
        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);

            this._alwaysCb(status, data);
            if (status === 200) {
                this._doneCb(data);
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
                ErrorActions.setMsgError(LoginTAG, msg);
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
    'reWatch',
    'resetWatch',
    'openEventChannel',
]);

const ProtoMap = {
    ProtoOnNodeStatus: 0,
    ProtoOnWatchIni: 1,
    ProtoOnWatchUpd: 2,
    ProtoOnWatchDel: 3,
    ProtoOnWatchStop: 4,
    ProtoOnWarn: 5,
};

class EventStore extends BaseStore {

    static types = {
        watchEnums: PropTypes.object,
        watchIds: PropTypes.object,
        watchProcedures: PropTypes.object,
        watchThings: PropTypes.object,
        watchTypes: PropTypes.object,
    }

    static defaults = {
        watchEnums: {},
        watchIds: {},
        watchProcedures: {},
        watchThings: {},
        watchTypes: {},
    }

    constructor() {
        super(EventActions);
        this.state = EventStore.defaults;
    }

    onOpenEventChannel() {
        socket.emit('getEvent');
        socket.on('event', (data) => {
            console.log(data);
            switch(data.Proto){
            case ProtoMap.ProtoOnWatchIni:
                this.watchInit(data.Data);
                break;
            case ProtoMap.ProtoOnWatchUpd:
                this.watchUpdate(data.Data);
                break;
            case ProtoMap.ProtoOnWatchDel:
                this.unwatch(data.Data['#']);
                break;
            case ProtoMap.ProtoOnNodeStatus:
                this.nodeStatus(data.Data);
                break;
            case ProtoMap.ProtoOnWatchStop:
                this.unwatch(data.Data['#']);
                break;
            case ProtoMap.ProtoOnWarn:
                ErrorActions.setMsgError(WatcherTAG, data.Data.warn_msg);
                break;
            default:

            }
        });
    }

    onWatch(scope, id='', tag=null) {
        const idString = `${id}`;
        this.emit('watch', {
            scope,
            ids: [idString]
        }).done(() => null).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    unwatch(id) {
        const {watchIds} = this.state;
        let scope = watchIds[id];

        this.setState(prevState => {

            let copyThings = JSON.parse(JSON.stringify(prevState.watchThings)); // copy
            Object.keys(copyThings[scope]).length<2 ? delete copyThings[scope] : delete copyThings[scope][id];

            let copyIds = JSON.parse(JSON.stringify(prevState.watchIds)); // copy
            delete copyIds[id];

            let res = {watchThings: copyThings, watchIds: copyIds};

            let copyProcedures = JSON.parse(JSON.stringify(prevState.watchProcedures)); // copy
            if (copyProcedures[scope]&&copyProcedures[scope][id]) {
                delete copyProcedures[scope];

                let copyTypes = JSON.parse(JSON.stringify(prevState.watchTypes)); // copy
                delete copyTypes[scope];

                let copyEnums = JSON.parse(JSON.stringify(prevState.watchEnums)); // copy
                delete copyEnums[scope];

                res['watchProcedures'] = copyProcedures;
                res['watchTypes'] = copyTypes;
                res['watchEnums'] = copyEnums;
            }
            return res;
        });
    }

    onUnwatch(id, tag=null) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        const idString = `${id}`;
        this.emit('unwatch', {
            scope,
            ids: [idString]
        }).done(() => null).fail((event, status, message) => {
            tag?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
        });
    }

    onReWatch() {
        const {watchIds} = this.state;
        this.onWatch('@n');
        Object.entries(watchIds).map(([id, scope]) => {
            this.onWatch(scope, id);
        });
    }

    onResetWatch() {
        this.setState({
            watchThings: {},
            watchIds: {}
        });
    }

    watchInit(data) {
        let scope = `@collection:${data.collection}`;

        this.setState(prevState => {
            const watchIds = {...prevState.watchIds, [data.thing['#']]: scope};
            const watchThings = {...prevState.watchThings, [scope]: {...prevState.watchThings[scope], [data.thing['#']]: data.thing}};
            let res = {watchThings: watchThings, watchIds: watchIds};

            if (data.procedures) {
                let proc = data.procedures.reduce((res, item) => { res[item.name] = item.definition; return res;}, {});
                let typ = data.types.reduce((res, item) => { res[item.name] = item; return res;}, {});
                let enu = data.enums.reduce((res, item) => { res[item.name] = item; return res;}, {});

                const watchProcedures = {...prevState.watchProcedures, [scope]: {...prevState.watchProcedures[scope], [data.thing['#']]: proc}};
                const watchTypes = {...prevState.watchTypes, [scope]: {...prevState.watchTypes[scope], [data.thing['#']]: typ}};
                const watchEnums = {...prevState.watchEnums, [scope]: {...prevState.watchEnums[scope], [data.thing['#']]: enu}};

                res['watchProcedures'] = watchProcedures;
                res['watchTypes'] = watchTypes;
                res['watchEnums'] = watchEnums;
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
                this.new_procedure(data['#'], data.jobs[i].new_procedure);
                break;
            case data.jobs[i].hasOwnProperty('del_procedure'):
                this.del_procedure(data['#'], data.jobs[i].del_procedure);
                break;
            case data.jobs[i].hasOwnProperty('mod_type_add'):
                this.mod_type_add(data['#'], data.jobs[i].mod_type_add);
                break;
            case data.jobs[i].hasOwnProperty('mod_type_mod'):
                this.mod_type_mod(data['#'], data.jobs[i].mod_type_mod);
                break;
            case data.jobs[i].hasOwnProperty('mod_type_del'):
                this.mod_type_del(data['#'], data.jobs[i].mod_type_del);
                break;
            case data.jobs[i].hasOwnProperty('mod_type_ren'):
                this.mod_type_ren(data['#'], data.jobs[i].mod_type_ren);
                console.log(data)
                break;
            case data.jobs[i].hasOwnProperty('new_type'):
                this.new_type(data['#'], data.jobs[i].new_type);
                break;
            case data.jobs[i].hasOwnProperty('set_type'):
                this.set_type(data['#'], data.jobs[i].set_type);
                break;
            case data.jobs[i].hasOwnProperty('del_type'):
                this.del_type(data['#'], data.jobs[i].del_type);
                break;
            case data.jobs[i].hasOwnProperty('mod_enum_add'):
                console.log(data)
                // this.mod_enum_add(data['#'], data.jobs[i].mod_enum_add);
                break;
            case data.jobs[i].hasOwnProperty('mod_enum_mod'):
                console.log(data)
                // this.mod_enum_mod(data['#'], data.jobs[i].mod_enum_mod);
                break;
            case data.jobs[i].hasOwnProperty('mod_enum_def'):
                console.log(data)
                // this.mod_enum_def(data['#'], data.jobs[i].mod_enum_def);
                break;
            case data.jobs[i].hasOwnProperty('mod_enum_del'):
                console.log(data)
                // this.mod_enum_del(data['#'], data.jobs[i].mod_enum_del);
                break;
            case data.jobs[i].hasOwnProperty('mod_enum_ren'):
                // this.mod_enum_ren(data['#'], data.jobs[i].mod_enum_ren);
                console.log(data)
                break;
            case data.jobs[i].hasOwnProperty('set_enum'):
                console.log(data)
                // this.set_enum(data['#'], data.jobs[i].set_enum);
                break;
            case data.jobs[i].hasOwnProperty('del_enum'):
                console.log(data)
                // this.del_enum(data['#'], data.jobs[i].del_enum);
                break;
            default:

            }
        }
    }

    editState(propName, scope, id, name, obj) {
        this.setState(prevState => {
            const prev = prevState[propName];
            const update = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [name]: obj}}};
            return {[propName]: update};
        });
    }
    deleteState(propName, scope, id, name) {
        this.setState(prevState => {
            const prev = prevState[propName];
            let copyState = JSON.parse(JSON.stringify(prev[scope][id])); // copy
            delete copyState[name];
            const update = {...prev, [scope]: {...prev[scope], [id]: copyState}};
            return {[propName]: update};
        });
    }

    new_procedure(id, newProcedure) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        let name = newProcedure.name;
        let def = newProcedure['closure']['/'];
        this.editState('watchProcedures', scope, id, name, def);
    }

    del_procedure(id, del) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        this.deleteState('watchProcedures', scope, id, del);
    }

    mod_type_add(id, add) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == add.type_id);
        type.fields.push([add.name, add.spec]);
        let obj = {
            name: type.name,
            type_id: add.type_id,
            fields: type.fields,
        };
        this.editState('watchTypes', scope, id, type.name, obj);
    }

    mod_type_mod(id, mod) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == mod.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==mod.name);
        type.fields.splice(fieldsIndex, 1, [mod.name, mod.spec]);
        let obj = {
            name: type.name,
            type_id: mod.type_id,
            fields: type.fields,
        };
        this.editState('watchTypes', scope, id, type.name, obj);
    }

    mod_type_ren(id, ren) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == ren.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==ren.name);
        type.fields.splice(fieldsIndex, 1, [ren.to, type.fields[fieldsIndex][1]]);
        let obj = {
            name: type.name,
            type_id: ren.type_id,
            fields: type.fields,
        };
        this.editState('watchTypes', scope, id, type.name, obj);
    }

    mod_type_del(id, del) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == del.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==del.name);
        type.fields.splice(fieldsIndex, 1);
        let obj = {
            name: type.name,
            type_id: del.type_id,
            fields: type.fields,
        };
        this.editState('watchTypes', scope, id, type.name, obj);
    }

    new_type(id, newType) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        let name = newType.name;
        let obj = {
            name: newType.name,
            type_id: newType.type_id,
            fields: [],
        };
        this.editState('watchTypes', scope, id, name, obj);
    }

    set_type(id, set) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == set.type_id);
        let obj = {
            name: type.name,
            type_id: set.type_id,
            fields: set.fields,
        };
        this.editState('watchTypes', scope, id, type.name, obj);
    }

    del_type(id, del) {
        const {watchIds, watchTypes} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchTypes[scope][id]).find(t => t.type_id == del);
        this.deleteState('watchTypes', scope, id, type.name);
    }

    mod_enum_add(id, add) {  // enum_id, modified_at, name, value
        const {watchIds, watchEnums} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchEnums[scope][id]).find(t => t.type_id == add.type_id);
        type.fields.push([add.name, add.spec]);
        let obj = {
            name: type.name,
            type_id: add.type_id,
            fields: type.fields,
        };
        this.editState('watchEnums', scope, id, type.name, obj);
    }

    mod_enum_mod(id, mod) { // enum_id, modified_at, index, value
        const {watchIds, watchEnums} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchEnums[scope][id]).find(t => t.type_id == mod.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==mod.name);
        type.fields.splice(fieldsIndex, 1, [mod.name, mod.spec]);
        let obj = {
            name: type.name,
            type_id: mod.type_id,
            fields: type.fields,
        };
        this.editState('watchEnums', scope, id, type.name, obj);
    }

    mod_enum_ren(id, ren) { // enum_id, modified_at, index, name
        const {watchIds, watchEnums} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchEnums[scope][id]).find(t => t.type_id == ren.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==ren.name);
        type.fields.splice(fieldsIndex, 1, [ren.to, type.fields[fieldsIndex][1]]);
        let obj = {
            name: type.name,
            type_id: ren.type_id,
            fields: type.fields,
        };
        this.editState('watchEnums', scope, id, type.name, obj);
    }

    mod_enum_def(id, del) { // enum_id, index, modified_at
        const {watchIds, watchEnums} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchEnums[scope][id]).find(t => t.type_id == del.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==del.name);
        type.fields.splice(fieldsIndex, 1);
        let obj = {
            name: type.name,
            type_id: del.type_id,
            fields: type.fields,
        };
        this.editState('watchEnums', scope, id, type.name, obj);
    }

    mod_enum_del(id, del) {  // enum_id, index, modified_at
        const {watchIds, watchEnums} = this.state;
        let scope = watchIds[id];
        let type = Object.values(watchEnums[scope][id]).find(t => t.type_id == del.type_id);
        let fieldsIndex = type.fields.findIndex(f => f[0]==del.name);
        type.fields.splice(fieldsIndex, 1);
        let obj = {
            name: type.name,
            type_id: del.type_id,
            fields: type.fields,
        };
        this.editState('watchEnums', scope, id, type.name, obj);
    }

    set(id, set) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        let key = Object.keys(set)[0];
        let obj = set[key].hasOwnProperty('#') ? {'#': set[key]['#']} : set[key];
        this.editState('watchThings', scope, id, key, obj);
    }

    del(id, del) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        this.deleteState('watchThings', scope, id, del);
    }

    splice(id, splice) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        const prop = Object.keys(splice)[0];
        const index = splice[prop][0];
        const deleteCount = splice[prop][1];
        const length = splice[prop].length;


        this.setState(prevState => {
            const prev = prevState.watchThings;
            const copyArr = [...prev[scope][id][prop]];

            if (length>2) {
                copyArr.splice(index, deleteCount, ...splice[prop].slice(2));
            } else {
                copyArr.splice(index, deleteCount);
            }
            const watchThings = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [prop]: copyArr}}};
            return {watchThings};
        });

    }

    add(id, add) {
        const {watchIds} = this.state;
        let scope = watchIds[id];

        const prop = Object.keys(add);
        this.setState(prevState => {
            const prev = prevState.watchThings;
            const copySet = new Set([...prev[scope][id][prop]['$']]);
            for (let i = 0; i<add[prop].length; i++ ) {
                copySet.add(add[prop][i]);
            }
            const newSet = {'$': [...copySet]};
            const watchThings = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [prop]: newSet}}};
            return {watchThings};
        });
    }

    remove(id, remove) {
        const {watchIds} = this.state;
        let scope = watchIds[id];

        const prop = Object.keys(remove);
        this.setState(prevState => {
            const prev = prevState.watchThings;
            const copySet = new Set([...prevState.watchThings[scope][id][prop]['$']]);
            for (let i = 0; i<remove[prop].length; i++ ) {
                copySet.forEach(function(t){
                    if (t['#'] == remove[prop][i]) {
                        copySet.delete(t);
                    }
                });
            }
            const newSet = {'$': [...copySet]};
            const watchThings = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [prop]: newSet}}};
            return {watchThings};
        });
    }

    nodeStatus(data) {
        if (data=='SHUTTING_DOWN') {
            ApplicationActions.reconnect();
            ErrorActions.setToastError('Lost connection with ThingsDB. Trying to reconnect.');
        }
    }
}

export {BaseStore, EventActions, EventStore};