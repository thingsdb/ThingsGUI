import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore.js';

const ApplicationActions = Vlow.createActions([
    'connect',
    'disconnect',
    'navigate',
    'addCollection',
    'removeCollection',
    'renameCollection',
    'addUser',
    'removeUser',
    'renameUser',
    'grant',
    'revoke',
    'resetCounters',
    'shutdown',
]);

class ApplicationStore extends BaseStore {

    static types = {
        loaded: PropTypes.bool,
        connected: PropTypes.bool,
        connErr: PropTypes.string,
        match: PropTypes.object,
        collections: PropTypes.arrayOf(PropTypes.object),
        nodes: PropTypes.arrayOf(PropTypes.object),
        users: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
        counters: PropTypes.object,
    }

    static defaults = {
        loaded: false,
        connected: false,
        connErr: '',
        match: {},

        collections: [],
        nodes: [],
        users: [],
        node: {},
        counters: {},
    };

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;

        this._fetch();
    }

    onNavigate(match) {
        this.setState({match});
    }

    onShutdown() {
        this.emit('/shutdown')
            .done(() => {
                this.setState({
                    connected: false,
                    connErr: '',
                    path: '',
                    collections: [],
                    nodes: [],
                    users: [],
                    node: {},
                    counters: {},
                });
            });
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
                    node: {},
                    counters: {},
                });
            });
    }

    onAddCollection(name) {
        this.emit('/collection/add', {
            name
        })
            .done(() => {
                this._fetch();
            });
    }

    onRemoveCollection(name) {
        this.emit('/collection/remove', {
            name
        })
            .done(() => {
                this._fetch();
                // this.setState(prev => ({
                //     collections: prev.collections.filter((d) => d.name!==name)
                // }));
            });
    }

    onRenameCollection(collection, name) {
        this.emit('/collection/rename', {
            collection,
            name,
        })
            .done(() => {
                // const {match} = this.state;
                // match.collection.name = name;
                // this.setState({match});
                this._fetch();
            });
    }

    onAddUser(name, password) {
        this.emit('/user/add', {
            name,
            password,
        })
            .done(() => {
                this._fetch();
            });
    }

    onRemoveUser(name) {
        this.emit('/user/remove', {
            name
        })
            .done(() => {
                this._fetch();
            });
    }

    onRenameUser(user, name) {
        this.emit('/user/rename', {
            user,
            name,
        })
            .done(() => {
                this._fetch();
            });
    }

    onGrant(collection, user, access) {
        this.emit('/grant', {
            collection,
            user,
            access,
        })
            .done(() => {
                this._fetch();
            });
    }

    onRevoke(collection, user, access) {
        this.emit('/revoke', {
            collection,
            user,
            access,
        })
            .done(() => {
                this._fetch();
            });
    }

    onResetCounters() {
        this.emit('/counters/reset')
            .done(() => {
                this._fetch();
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