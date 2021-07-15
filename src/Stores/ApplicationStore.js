/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore, EventActions} from './BaseStore';
import {CollectionActions} from './CollectionStore';
import {ErrorActions} from './ErrorStore';
import {NodesActions} from './NodesStore';
import {ThingsdbActions} from './ThingsdbStore';

const ApplicationActions = Vlow.createActions([
    'isAuthOnly',
    'authKey',
    'authToken',
    'authPass',
    'closeEditor',
    'connected',
    'connectToNew',
    'connectViaCache',
    'delCachedConn',
    'disconnect',
    'editCachedConn',
    'getCachedConn',
    'newCachedConn',
    'openEditor',
    'reconnect',
    'renameCachedConn',
    'storeSession'
]);


class ApplicationStore extends BaseStore {

    static types = {
        authOnly: PropTypes.bool,
        authMethod:PropTypes.string,
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        seekConnection: PropTypes.bool,
        openEditor: PropTypes.bool,
        input: PropTypes.string,
        cachedConnections: PropTypes.object,
        useCookies: PropTypes.bool
    }

    static defaults = {
        authOnly: false,
        authMethod: '',
        loaded: false,
        connected: false,
        seekConnection: true,
        openEditor: false,
        input: '',
        cachedConnections: {},
        useCookies: false
    }

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;
    }

    connect(api, config, tag) {
        this.setState({
            loaded: false,
            seekConnection: false,
        });
        this.emit(api, config).done((data) => {
            ThingsdbActions.getUser(
                ()=>{
                    this.setState({
                        connected: data.Connected,
                        useCookies: data.UseCookies,
                        loaded: true,
                        seekConnection:true,
                    });
                    EventActions.watch('@n');
                },
                ()=>this.setState({loaded: true, useCookies: data.UseCookies, seekConnection: false}));
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            this.setState({loaded: true, seekConnection: true});
        });

    }

    onConnected() {
        this.emit('connected').done((data) => {
            this.setState({
                connected: data.Connected,
                useCookies: data.UseCookies,
                seekConnection: true,
            });
            setTimeout(() => {
                this.setState({
                    loaded: true,
                });
            }, 2000);
            if (data.Connected) {
                ThingsdbActions.getUser();
            }
        }).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log);
            this.setState({connected: false, loaded: true, seekConnection: false});
        });
    }

    onStoreSession() {
        this.post('/session').done(() => {
            this.emit('cookie', document.cookie);
        }).fail((error, message) => {
            ErrorActions.setToastError(`${error.statusText}: ${message}`);
        });
    }

    onConnectToNew(config, tag) {
        this.connect('connToNew', config, tag);
    }

    onConnectViaCache(config, tag) {
        this.connect('connViaCache', config, tag);
    }

    onIsAuthOnly() {
        this.emit('authOnly').done((data) => {
            this.setState({
                authOnly: data.AuthOnly,
                authMethod: data.AuthMethod,
            });
        });
    }

    onAuthKey(key, tag) {
        this.connect('authKey', {key: key}, tag);
    }

    onAuthToken(token, tag) {
        this.connect('authToken', {token: token}, tag);
    }

    onAuthPass(user, pass, tag) {
        this.connect('authPass', {user: user, pass: pass}, tag);
    }

    onReconnect() {
        this.emit('reconn').done((data) => {
            this.setState({
                connected: data.Connected,
            });
            EventActions.reWatch();
            ErrorActions.resetToastError();
        }).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log); //Tag of login screen
            this.onDisconnect();
        });
    }

    onDisconnect() {
        EventActions.resetWatch();
        this.emit('disconn').done((data) => {
            CollectionActions.resetCollectionStore();
            ErrorActions.resetToastError();
            ThingsdbActions.resetThingsStore();
            NodesActions.resetNodesStore();
            this.setState({
                connected: data.Connected,
                match: {},
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onEditCachedConn(config, tag, cb) {
        this.emit('editCachedConn', config).done((_data) => {
            this.setState(prevState => {
                const savedConn = {... prevState.cachedConnections, [config.name]: {...prevState.cachedConnections[config.name], ...config}};
                const update = {...prevState, cachedConnections: savedConn};
                return update;
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetCachedConn(tag) {
        this.emit('getCachedConn').done((data) => {
            this.setState({cachedConnections: data||{}});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onNewCachedConn(config, tag, cb) {
        this.emit('newCachedConn', config).done((_data) => {
            this.setState(prevState => {
                const savedConn = {... prevState.cachedConnections, [config.name]: config};
                const update = {...prevState, cachedConnections: savedConn};
                return update;
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameCachedConn(config, oldName, tag, cb) {
        this.emit('renameCachedConn', {newName: config.name, oldName: oldName}).done((_data) => {
            this.setState(prevState => {
                let copy = JSON.parse(JSON.stringify(prevState.cachedConnections)); // copy
                delete copy[oldName];
                const savedConn =  {...copy, [config.name]: config};
                const update = {...prevState, cachedConnections: savedConn};
                return update;
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onDelCachedConn(config, tag) {
        this.emit('delCachedConn', config).done((_data) => {
            this.setState(prevState => {
                let copy = JSON.parse(JSON.stringify(prevState.cachedConnections)); // copy
                delete copy[config.name];
                const update = {...prevState, cachedConnections: copy};
                return update;
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onOpenEditor(input='') {
        this.setState({openEditor: true, input: input});
    }
    onCloseEditor() {
        this.setState({openEditor: false, input: ''});
    }
}

export {ApplicationActions, ApplicationStore};