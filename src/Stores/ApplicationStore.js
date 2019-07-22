import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const ApplicationActions = Vlow.createActions([
    'connected',
    'connect',
    'disconnect',
    'navigate',
]);

class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        connErr: PropTypes.string,
        match: PropTypes.shape({match: PropTypes.string}),
        collections: PropTypes.arrayOf(PropTypes.object),
        nodes: PropTypes.arrayOf(PropTypes.object),
        users: PropTypes.arrayOf(PropTypes.object),
    }

    static defaults = {
        loaded: false,
        connected: false,
        connErr: '',
        match: {},
        collections: [],
        nodes: [],
        users: [],
    }

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;
    }

    onConnected() {
        this.emit('/connected').done((data) => {
            this.setState({
                loaded: data.loaded,
                connected: data.connected,
            });
        });
    }

    onConnect({host, user, password}) {
        this.emit('/connect', {host, user, password}).done((data) => {
            this.setState({
                connErr: data.connErr,
                connected: data.connected,
                collections: data.collections,
                nodes: data.nodes,
                users: data.users,
            });
        });
    }

    onDisconnect() {
        this.emit('/disconnect').done(() => {
            this.setState({
                connected: false,
                connErr: '',
                match: {},
                collections: [],
                nodes: [],
                users: [],
            });
        });
    }

    onNavigate(match) {
        this.setState({match});
    }
}

export {ApplicationActions, ApplicationStore};