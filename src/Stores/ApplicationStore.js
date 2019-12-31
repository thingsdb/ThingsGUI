import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore, EventActions} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {NodesActions} from './NodesStore';
import {ThingsdbActions} from './ThingsdbStore';

const ApplicationActions = Vlow.createActions([
    'connected',
    'connect',
    'disconnect',
    'navigate',
    'openEditor',
    'closeEditor',
    'logging',
    'savedConnections',
    'getConn',
    'newConn',
    'editConn',
    'delConn',
    'connectToo',
]);

// TODO: CALLBACKS
class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        match: PropTypes.shape({path: PropTypes.string, index: PropTypes.number, item: PropTypes.string, scope: PropTypes.string}),
        openEditor: PropTypes.bool,
        input: PropTypes.string,
        savedConnections: PropTypes.array
    }

    static defaults = {
        loaded: false,
        connected: false,
        match: {
            path: '',
            index: 0,
            item: '',
            scope: '',
        },
        openEditor: false,
        input: '',
        savedConnections: []
    }

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;
    }

    onLogging() {
        this.push();
    }

    onConnected() {
        this.emit('connected').done((data) => {
            setTimeout(() => {
                this.setState({
                    loaded: data.Loaded,
                    connected: data.Connected,
                });
            }, 1000);
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onConnect(config, tag) {
        this.emit('conn', config).done((data) => {
            this.setState({
                connected: data.Connected,
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
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
            this.setState({savedConnections: data});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onNewConn(config, tag) {
        this.emit('newEditConn', config).done((_data) => {
            this.setState(prevState => {
                const copy = [...prevState.savedConnections];
                const savedConn = copy.push(config.name);
                const update = Object.assign({}, prevState, {savedConnections: savedConn});
                return update;
            });
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
        this.emit('newEditConn', config).done((_data) => {
            this.setState(prevState => {
                const copy = [...prevState.savedConnections];
                const i = copy.indexOf(config.name);
                copy.splice(i, 1);
                const update = Object.assign({}, prevState, {savedConnections: copy});
                return update;
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onConnectToo(config, tag) {
        this.emit('connToo', config).done((data) => {
            this.setState({
                connected: data.Connected,
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }
}

export {ApplicationActions, ApplicationStore};