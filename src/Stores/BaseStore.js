import Vlow from 'vlow';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

import {ApplicationActions} from './ApplicationStore';
import {ErrorActions} from './ErrorStore';
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
    'openEvCh',
]);

const ProtoMap = {
    ProtoOnNodeStatus: 0,
    ProtoOnWatchIni: 1,
    ProtoOnWatchUpd: 2,
    ProtoOnWatchDel: 3,
    ProtoOnWatchStop: 4,
    ProtoOnWarn: 5,
};

const swap = (items, index) => {
    const i = items[0];
    items[0] = items[index];
    items[index] = i;
    return items;
};

class EventStore extends BaseStore {

    static types = {
        watchEnums: PropTypes.object,
        watchEvents: PropTypes.object,
        watchIds: PropTypes.object,
        watchProcedures: PropTypes.object,
        watchThings: PropTypes.object,
        watchTypes: PropTypes.object,
    }

    static defaults = {
        watchEnums: {},
        watchEvents: {},
        watchIds: {},
        watchProcedures: {},
        watchThings: {},
        watchTypes: {},
    }

    constructor() {
        super(EventActions);
        this.state = EventStore.defaults;
    }

    // STOREACTIONS

    onOpenEvCh() {
        socket.emit('getEvent');
        socket.on('event', (data) => {
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
        Object.entries(watchIds).forEach(([id, scope]) => {
            this.onWatch(scope, id);
        });
    }

    onResetWatch() {
        this.setState({
            watchEnums: {},
            watchEvents: {},
            watchIds: {},
            watchProcedures: {},
            watchThings: {},
            watchTypes: {},
        });
    }

    // HELPER FUNCTIONS

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

    getScope(id) {
        const {watchIds} = this.state;
        let scope = watchIds[id];
        return scope;
    }

    // WATCH EVENTS

    nodeStatus(data) {
        if (data=='SHUTTING_DOWN') {
            ApplicationActions.reconnect();
            ErrorActions.setToastError('Lost connection with ThingsDB. Trying to reconnect.');
        }
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
            const key = Object.keys(data.jobs[i])[0];
            this[key]&&this[key](data['#'], data.jobs[i][key]);
        }
    }

    // ON_UPDATE MUTATIONS

    unwatch(id) {
        const {watchIds} = this.state;
        let scope = watchIds[id];

        this.setState(prevState => {

            let copyThings = JSON.parse(JSON.stringify(prevState.watchThings)); // copy
            Object.keys(copyThings[scope]).length<2 ? delete copyThings[scope] : delete copyThings[scope][id];

            let copyIds = JSON.parse(JSON.stringify(prevState.watchIds)); // copy
            delete copyIds[id];

            let copyEvents = JSON.parse(JSON.stringify(prevState.watchEvents)); // copy
            copyEvents[scope]&&(Object.keys(copyEvents[scope]).length<2 ? delete copyEvents[scope] : copyEvents[scope][id]&&delete copyEvents[scope][id]);

            let res = {watchThings: copyThings, watchIds: copyIds, watchEvents: copyEvents};

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

    ////// PROCEDURES


    new_procedure(id, newProcedure) {
        this.editState('watchProcedures', this.getScope(id), id, newProcedure.name, newProcedure['closure']['/']);
    }

    del_procedure(id, del) {
        this.deleteState('watchProcedures', this.getScope(id), id, del);
    }


    ////// TYPES


    getType(id, scope, objId) {
        const {watchTypes} = this.state;
        const type = Object.values(watchTypes[scope][id]).find(t => t.type_id == objId);
        return JSON.parse(JSON.stringify(type)); //copy
    }

    mod_type(id, mod, modfn) {
        const scope = this.getScope(id);
        const type = this.getType(id, scope, mod.type_id);
        const modType = modfn(type, mod);
        this.editState('watchTypes', scope, id, type.name, modType);
    }

    mod_type_add(id, obj) {
        const modfn = (type, mod) => {
            type.fields.push([mod.name, mod.spec]);
            type.modified_at = obj.modified_at;
            return type;
        };
        this.mod_type(id, obj, modfn);
    }

    mod_type_mod(id, obj) {
        const modfn = (type, mod) => {
            const fieldsIndex = type.fields.findIndex(f => f[0]==mod.name);
            type.fields.splice(fieldsIndex, 1, [mod.name, mod.spec]);
            type.modified_at = obj.modified_at;
            return type;
        };
        this.mod_type(id, obj, modfn);
    }

    mod_type_ren(id, obj) {
        const modfn = (type, mod) => {
            const fieldsIndex = type.fields.findIndex(f => f[0]==mod.name);
            let spec = type.fields[fieldsIndex][1];
            type.fields.splice(fieldsIndex, 1, [mod.to, spec]);
            type.modified_at = obj.modified_at;
            return type;
        };
        this.mod_type(id, obj, modfn);
    }

    mod_type_del(id, obj) {
        const modfn = (type, mod) => {
            let fieldsIndex = type.fields.findIndex(f => f[0]==mod.name);
            type.fields.splice(fieldsIndex, 1);
            type.modified_at = obj.modified_at;
            return type;
        };
        this.mod_type(id, obj, modfn);
    }

    new_type(id, obj) {
        this.editState('watchTypes', this.getScope(id), id, obj.name, {...obj, modified_at: obj.modified_at, fields: []});
    }

    set_type(id, obj) {
        const scope = this.getScope(id);
        const type = this.getType(id, scope, obj.type_id);
        this.editState('watchTypes', scope, id, type.name, {...type, modified_at: obj.modified_at, fields: obj.fields});
    }

    del_type(id, index) {
        const scope = this.getScope(id);
        this.deleteState('watchTypes', scope, id, this.getType(id, scope, index).name);
    }



    ////// ENUMS


    getEnum(id, scope, objId) {
        const {watchEnums} = this.state;
        const enu = Object.values(watchEnums[scope][id]).find(t => t.enum_id == objId);
        return JSON.parse(JSON.stringify(enu)); //copy
    }


    mod_enum(id, mod, modfn) {
        const scope = this.getScope(id);
        const enu = this.getEnum(id, scope, mod.enum_id);
        const modEnum = modfn(enu, mod);
        this.editState('watchEnums', scope, id, enu.name, modEnum);
    }

    mod_enum_add(id, obj) { // enum_id, modified_at, name, value
        const modfn = (enu, mod) => {
            enu.members.push([mod.name, mod.value]);
            enu.modified_at = obj.modified_at;
            return enu;
        };
        this.mod_enum(id, obj, modfn);
    }

    mod_enum_mod(id, obj) { // enum_id, modified_at, index, value
        const modfn = (enu, mod) => {
            enu.members.splice(mod.index, 1, [enu.members[mod.index][0], mod.value]);
            enu.modified_at = obj.modified_at;
            return enu;
        };
        this.mod_enum(id, obj, modfn);
    }

    mod_enum_ren(id, obj) { // enum_id, modified_at, index, name
        const modfn = (enu, mod) => {
            enu.members.splice(mod.index, 1, [mod.name, enu.members[mod.index][1]]);
            enu.modified_at = obj.modified_at;
            return enu;
        };
        this.mod_enum(id, obj, modfn);
    }

    mod_enum_def(id, obj) { // enum_id, index, modified_at
        const modfn = (enu, mod) => {
            enu.default = enu.members[mod.index][0];
            enu.members = swap(enu.members, mod.index);
            enu.modified_at = obj.modified_at;
            return enu;
        };
        this.mod_enum(id, obj, modfn);
    }


    mod_enum_del(id, obj) { // enum_id, index, modified_at
        const modfn = (enu, mod) => {
            enu.members.splice(mod.index, 1);
            enu.modified_at = obj.modified_at;
            const lastIndex = enu.members.length-1;
            enu.default = enu.members[lastIndex][0];
            enu.members = swap(enu.members, lastIndex);
            return enu;
        };
        this.mod_enum(id, obj, modfn);
    }

    set_enum(id, obj) {
        const scope = this.getScope(id);
        this.editState('watchEnums', scope, id, obj.name, {...obj, default: obj.members[0][0], modified_at: null});
    }

    del_enum(id, index) {
        const scope = this.getScope(id);
        this.deleteState('watchEnums', scope, id, this.getEnum(id, scope, index).name);
    }


    ////// THINGS

    _set(set) {
        let obj;
        if (Array.isArray(set)){
            obj = set.map(s=>this._set(s));
        } else if (set.hasOwnProperty('$')){
            obj = {'$': set['$'].map(s =>s.hasOwnProperty('#') ? {'#': s['#']} : s)};
        } else {
            obj = set.hasOwnProperty('#') ? {'#': set['#']} : set;
        }

        return obj;
    }


    set(id, set) {
        let key = Object.keys(set)[0];
        let obj = this._set(set[key])

        this.editState('watchThings', this.getScope(id), id, key, obj);
    }

    del(id, del) {
        this.deleteState('watchThings', this.getScope(id), id, del);
    }

    splice(id, splice) {
        const scope = this.getScope(id);
        const prop = Object.keys(splice)[0];
        const index = splice[prop][0];
        const deleteCount = splice[prop][1];
        const length = splice[prop].length;


        this.setState(prevState => {
            const prev = prevState.watchThings;
            const copyArr = [...prev[scope][id][prop]];

            if (length>2) {
                copyArr.splice(index, deleteCount, ...this._set(splice[prop].slice(2)));
            } else {
                copyArr.splice(index, deleteCount);
            }
            const watchThings = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [prop]: copyArr}}};
            return {watchThings};
        });

    }

    add(id, add) {
        const scope = this.getScope(id);
        const prop = Object.keys(add)[0];
        this.setState(prevState => {
            const prev = prevState.watchThings;
            const copySet = new Set([...prev[scope][id][prop]['$']]);
            for (let i = 0; i<add[prop].length; i++ ) {
                copySet.add({'#': add[prop][i]['#']});
            }
            const newSet = {'$': [...copySet]};
            const watchThings = {...prev, [scope]: {...prev[scope], [id]: {...prev[scope][id], [prop]: newSet}}};
            return {watchThings};
        });
    }

    remove(id, remove) {
        const scope = this.getScope(id);
        const prop = Object.keys(remove)[0];
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

    event(id, obj) {
        const scope = this.getScope(id);
        this.setState(prevState => {
            const prev = prevState.watchEvents;
            const update = {...prev, [scope]: {...prev[scope], [id]: {...(prev[scope]&&prev[scope][id]||{}), [obj[0]]: [...(prev[scope]&&prev[scope][id]&&prev[scope][id][obj[0]]||[]), obj[1]]}}};
            return {watchEvents: update};
        });
    }
}

export {BaseStore, EventActions, EventStore};