import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';

const ApplicationActions = Vlow.createActions([
    'connected',
    'connect',
    'connectOther',
    'disconnect',
    'navigate',
    'openEditor',
    'closeEditor',
]);

// TODO: CALLBACKS
class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        match: PropTypes.shape({match: PropTypes.string}),
        openEditor: PropTypes.bool,
        input: PropTypes.string,
    }

    static defaults = {
        loaded: false,
        connected: false,
        match: {},
        openEditor: false,
        input: '',
    }

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;
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

    onConnect({host, user, password}, tag) {
        this.emit('conn', {host, user, password}).done((data) => {
            this.setState({
                connected: data.Connected,
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onConnectOther({host}, tag, cb) {
        this.emit('connToOther', {host}).done((data) => {
            this.setState({
                connected: data.Connected,
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onDisconnect() {
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