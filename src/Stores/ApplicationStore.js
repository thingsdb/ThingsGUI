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
    'password',
    'grant',
    'revoke',

    'node',
    'loglevel',
    'zone',
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
        nodesLookup: PropTypes.object,
    }

    static defaults = {
        loaded: true,
        connected: false,
        connErr: '',
        match: {},

        collections: [],
        nodes: [],
        users: [],
        node: {},
        nodesLookup: {},
    };

    constructor() {
        super(ApplicationActions);
        this.state = ApplicationStore.defaults;

        // this._fetch();
    }

    onNavigate(match) {
        this.setState({match});
    }

    _onDisconnect() {
        this.setState({
            connected: false,
            connErr: '',
            path: '',
            collections: [],
            nodes: [],
            users: [],
            node: {},
            nodesLookup: {},
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
                this._onDisconnect();
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

    onPassword(user, password) {
        this.emit('/user/password', {
            user,
            password,
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

    onNode(node) {
        this.emit('/node/get', {
            node,
        })
            .done((data) => {
                const {nodesLookup} = this.state;
                nodesLookup[node.node_id] = data;
                this.setState({nodesLookup});
            });
    }

    onLoglevel(node, level) {
        this.emit('/node/loglevel', {
            node, 
            level,
        })
            .done((data) => {
                const {nodesLookup} = this.state;
                nodesLookup[node.node_id].node = data.node;
                this.setState({nodesLookup});
            });
    }

    onZone(node, zone) {
        this.emit('/node/zone', {
            node, 
            zone,
        })
            .done((data) => {
                const {nodesLookup} = this.state;
                nodesLookup[node.node_id].node = data.node;
                this.setState({nodesLookup});
            });
    }

    onResetCounters(node) {
        this.emit('/node/counters/reset', {
            node,
        })
            .done((data) => {
                const {nodesLookup} = this.state;
                nodesLookup[node.node_id].counters = data.counters;
                this.setState({nodesLookup});
            });
    }

    onShutdown(node) {
        this.emit('/node/shutdown', {
            node,
        })
            .done(() => {
                //TODOK
                this._onDisconnect();
            });
    }
}

export {ApplicationStore, ApplicationActions};