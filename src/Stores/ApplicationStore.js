import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore.js';

const ApplicationActions = Vlow.createActions([
    'connect',
    'disconnect',
    'navigate',
    'addCollection',
]);

class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        connErr: PropTypes.string,
        path: PropTypes.string,
        collections: PropTypes.arrayOf(PropTypes.object),
        nodes: PropTypes.arrayOf(PropTypes.object),
        users: PropTypes.arrayOf(PropTypes.object),
        counters: PropTypes.object,
    }

    static defaults = {
        loaded: false,
        connected: false,
        connErr: '',
        path: '',

        collections: [],
        nodes: [],
        users: [],
        counters: {},
    };

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;

        this._fetch();
    }

    onNavigate(path) {
        this.setState({path});
    }

    onConnect(host, user, password) {
        this.emit('/connect', {
            host,
            user,
            password,
        })
            .done((data) => {
                this.setState({
                    ...data
                });
            });
    }

    onDisconnect() {
        this.emit('/disconnect')
            .done(() => {
                this.setState({
                    connected: false,
                    connErr: '',
                    path: '',
                    collections: [],
                    nodes: [],
                    users: [],
                    counters: {},
                });
            });
    }

    onAddCollection(name) {
        this.emit('/collection/add', {
            name
        })
            .done(() => {

            });
    }

    _fetch() {
        this.emit('/connected')
            .done((data) => {
                window.console.log(data);
                this.setState({
                    loaded: true,
                    ...data
                });
            });
    }
}

export {ApplicationStore, ApplicationActions};