/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore, EventActions} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {NodesActions} from './NodesStore';
import {ThingsdbActions} from './ThingsdbStore';

const ApplicationActions = Vlow.createActions([
    'closeEditor',
    'connect',
    'connected',
    'connectToo',
    'delConn',
    'disconnect',
    'editConn',
    'getConn',
    'pushNotifications',
    'navigate',
    'newConn',
    'openEditor',
    'reconnect',
]);

// TODO: CALLBACKS
class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        seekConnection: PropTypes.bool,
        match: PropTypes.shape({path: PropTypes.string, index: PropTypes.number, item: PropTypes.string, scope: PropTypes.string}),
        openEditor: PropTypes.bool,
        input: PropTypes.string,
        savedConnections: PropTypes.object
    }

    static defaults = {
        loaded: false,
        connected: false,
        seekConnection: true,
        match: {
            path: '',
            index: 0,
            item: '',
            scope: '',
        },
        openEditor: false,
        input: '',
        savedConnections: {}
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
                        loaded: true,
                        seekConnection:true,
                    });
                    EventActions.watch(
                        '@n',
                    );
                },
                ()=>this.setState({loaded: true, seekConnection: false}));
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            this.setState({loaded: true, seekConnection: true});
        });

    }

    onPushNotifications() {
        this.push();
    }

    onConnected() {
        this.emit('connected').done((data) => {
            setTimeout(() => {
                this.setState({
                    loaded: data.Loaded,
                    connected: data.Connected,
                });
            }, 2000);
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }



    onConnect(config, tag) {
        this.connect('conn', config, tag);
    }

    onReconnect() {
        this.emit('reconn').done((data) => {
            this.setState({
                connected: data.Connected,
            });
            EventActions.reWatch();
            ErrorActions.resetToastError();
        }).fail((event, status, message) => {
            // ErrorActions.setToastError(message.Log); //Tag naar login scherm
            this.onDisconnect();
        });
    }

    onDisconnect() {
        EventActions.resetWatch();
        this.emit('disconn').done((data) => {
            this.setState({
                connected: data.Connected,
                match: {},
            });
            ErrorActions.resetToastError();
            ThingsdbActions.resetThingsStore();
            NodesActions.resetNodesStore();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onNavigate(match) {
        this.setState({match});
    }

    onOpenEditor(input='') {
        this.setState({openEditor: true, input: input});
    }
    onCloseEditor() {
        this.setState({openEditor: false, input: ''});
    }

    onGetConn(tag) {
        this.emit('getConn').done((data) => {
            this.setState({savedConnections: data||{}});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onNewConn(config, tag, cb) {
        this.emit('newEditConn', config).done((_data) => {
            this.setState(prevState => {
                const savedConn = Object.assign({}, prevState.savedConnections, {[config.name]: config});
                const update = Object.assign({}, prevState, {savedConnections: savedConn});
                return update;
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onEditConn(config, tag) {
        this.emit('newEditConn', config).done((_data) => {

        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onDelConn(config, tag) {
        this.emit('delConn', config).done((_data) => {
            this.setState(prevState => {
                let copy = JSON.parse(JSON.stringify(prevState.savedConnections)); // copy
                delete copy[config.name];
                const update = Object.assign({}, prevState, {savedConnections: copy});
                return update;
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onConnectToo(config, tag) {
        this.connect('connToo', config, tag);
    }
}

export {ApplicationActions, ApplicationStore};