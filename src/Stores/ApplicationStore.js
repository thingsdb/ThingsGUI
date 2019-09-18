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
        this.emit('/connected').done((data) => {
            console.log(data)
            setTimeout(() => {
                this.setState({
                    loaded: data.loaded,
                    connected: data.connected,
                });
            }, 1000);
        }).fail((event, status, message) => ErrorActions.setToastError(message.log));
    }

    onConnect({host, user, password}, tag) {
        this.emit('/connect', {host, user, password}).done((data) => {
            this.setState({
                connected: data.connected,
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
        });
    }

    onConnectOther({host}, tag, cb) {
        this.emit('/connect/other', {host}).done((data) => {
            this.setState({
                connected: data.connected,
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
        });
    }

    onDisconnect() {
        this.emit('/disconnect').done((data) => {
            this.setState({
                connected: data.connected,
                match: {},
            });
            ErrorActions.resetToastError();
        }).fail((event, status, message) => ErrorActions.setToastError(message.log));
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