import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore, EventActions} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const ApplicationActions = Vlow.createActions([
    'connected',
    'connect',
    'disconnect',
    'navigate',
    'openEditor',
    'closeEditor',
    'logging',
]);

// TODO: CALLBACKS
class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        match: PropTypes.shape({path: PropTypes.string, index: PropTypes.number, item: PropTypes.string, scope: PropTypes.string}),
        openEditor: PropTypes.bool,
        input: PropTypes.string,
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
}

export {ApplicationActions, ApplicationStore};