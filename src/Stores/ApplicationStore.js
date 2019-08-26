import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const ApplicationActions = Vlow.createActions([
    'connected',
    'connect',
    'connectOther',
    'disconnect',
    'navigate',
]);

// TODO: CALLBACKS
class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        connErr: PropTypes.string,
        match: PropTypes.shape({match: PropTypes.string}),
    }

    static defaults = {
        loaded: false,
        connected: false,
        connErr: '',
        match: {},
    }

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;
    }

    onConnected() {
        this.emit('/connected').done((data) => {
            setTimeout(() => {
                this.setState({
                    loaded: data.loaded,
                    connected: data.connected,
                });
            }, 1000);
        });
    }

    onConnect({host, user, password}) {
        this.emit('/connect', {host, user, password}).done((data) => {
            this.setState({
                connErr: data.connErr,
                connected: data.connected,
            });
        });
    }

    onConnectOther({host}) {
        this.emit('/connect/other', {host}).done((data) => {
            this.setState({
                connErr: data.connErr, // QUEST: vangt deze alle errors af?
                connected: data.connected,
            });
        });
    }

    onDisconnect() {
        this.emit('/disconnect').done(() => {
            this.setState({
                connected: false,
                connErr: '',
                match: {},
            });
        });
    }

    onNavigate(match) {
        this.setState({match});
    }
}

export {ApplicationActions, ApplicationStore};