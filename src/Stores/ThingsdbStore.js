import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const scope='@thingsdb';

const ThingsdbActions = Vlow.createActions([

    //COLLECTIONS ACTIONS
    'getCollection',
    'getCollections',
    'addCollection',
    'renameCollection',
    'removeCollection',
    'setQuota',

    //USER ACTIONS
    'getUser',
    'getUsers',
    'addUser',
    'removeUser',
    'renameUser',
    'password',
    'resetPassword',
    'grant',
    'revoke',
    'newToken',
    'delToken',
    'delExpired',
]);

// TODO: CALLBACKS
class ThingsdbStore extends BaseStore {

    static types = {
        collections: PropTypes.arrayOf(PropTypes.object),
        collection: PropTypes.object,
        users: PropTypes.arrayOf(PropTypes.object),
        user: PropTypes.object,
    }

    static defaults = {
        collections: [],
        collection: {},
        users: [],
        user: {},
    }

    constructor() {
        super(ThingsdbActions);
        this.state = ThingsdbStore.defaults;
    }

    //COLLECTIONS

    onGetCollection() {
        const query='collection_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({collection: data});
        }).fail((event, status, message) => {
            this.setState({
                collection: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetCollections() {
        const query='collections_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({collections: data});
        }).fail((event, status, message) => {
            this.setState({
                collections: [],
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onAddCollection(name, tag, cb) {
        const {user} = this.state;
        const query=`new_collection('${name}'); {collections: collections_info(), users: users_info()};`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setState({
                    collections: data.collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameCollection(oldname, newname, tag, cb) {
        const {user} = this.state;
        const query=`rename_collection('${oldname}', '${newname}'); {collections: collections_info(), users: users_info()};`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setState({
                    collections: data.collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRemoveCollection(name, tag, cb) {
        const {user} = this.state;
        const query = `del_collection('${name}'); {collections: collections_info(), users: users_info()};`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setState({
                    collections: data.collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onSetQuota(name, quotaType, quota, tag, cb) {
        const query = `set_quota('${name}', '${quotaType}', ${quota}); collections_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                collections: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    //USERS

    onGetUser(){
        const query = 'user_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({user: data});
        }).fail((event, status, message) => {
            this.setState({
                user: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetUsers(){
        const query = 'users_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => {
            this.setState({
                users: [],
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onAddUser(name, tag, cb){
        const query = `new_user('${name}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRemoveUser(name, tag, cb) {
        const query = `del_user('${name}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameUser(oldname, newname, tag, cb) {
        const query = `rename_user('${oldname}', '${newname}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onPassword(name, password, tag, cb) {
        const query = `set_password('${name}', '${password}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onResetPassword(name, tag, cb) {
        const query = `set_password('${name}', nil); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onGrant(name, collection, access, tag) {
        const query = `grant('${collection}', '${name}', ${access}); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRevoke(name, collection, access, tag) {
        const query = `revoke('${collection}', '${name}', ${access}); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onNewToken(config, tag, cb){ // name [, expirationTime] [, description]
        // TODO CHECK
        const query = `new_token('${config.name}', expiration_time=${config.expirationTime||'nil'}, description='${config.description||''}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onDelToken(key){
        const query = `del_token('${key}'); users_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelExpired(){
        const query = 'del_expired(); users_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }
}

export {ThingsdbActions, ThingsdbStore};