
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {ApplicationActions} from './ApplicationStore';
import {LoginTAG} from '../Constants/Tags';

const scope='@thingsdb';

const ThingsdbActions = Vlow.createActions([
    'resetThingsStore',

    //COLLECTIONS ACTIONS
    'getCollection',
    'getCollections',
    'addCollection',
    'renameCollection',
    'removeCollection',

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

    onResetThingsStore() {
        this.setState({
            collections: [],
            collection: {},
            users: [],
            user: {},
        });
    }

    //COLLECTIONS

    onGetCollection() {
        const {collection} = this.state;
        const query='collection_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (!deepEqual(data, collection)){
                this.setState({collections: data});
            }
        }).fail((event, status, message) => {
            this.setState({
                collection: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetCollections() {
        const {collections} = this.state;
        const query='collections_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (!deepEqual(data, collections)){
                this.setState({collections: data});
            }
        }).fail((event, status, message) => {
            this.setState({
                collections: [],
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    returnCollectionsUser(scope, query, tag, cb) {
        const {collections} = this.state;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (!deepEqual(data, collections)){
                this.setState({
                    collections: data.collections,
                    user: data.user,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    returnCollectionsUsers(scope, query, tag, cb) {
        const {collections, users} = this.state;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (!deepEqual(data.collections, collections) || !deepEqual(data.users, users)){
                this.setState({
                    collections: data.collections,
                    users: data.users,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    checkBeforeCollectionUpdate(q, tag, cb=()=>null) {
        const {user} = this.state;
        if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
        user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
            const query=`${q}; {collections: collections_info(), users: users_info()};`;
            this.returnCollectionsUsers(scope, query, tag, cb);
        } else {
            const query=`${q}; {collections: collections_info(), user: user_info()};`;
            this.returnCollectionsUser(scope, query, tag, cb);
        }
    }

    onAddCollection(name, tag, cb) {
        this.checkBeforeCollectionUpdate(`new_collection('${name}')`, tag, cb);
    }

    onRenameCollection(oldname, newname, tag, cb) {
        this.checkBeforeCollectionUpdate(`rename_collection('${oldname}', '${newname}')`, tag, cb);
    }

    onRemoveCollection(name, tag, cb) {
        this.checkBeforeCollectionUpdate(`del_collection('${name}')`, tag, cb);
    }

    //USERS

    onGetUser(success=()=>null, failed=()=>null){
        const {user} = this.state;
        const query = 'user_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            if (!deepEqual(data, user)){
                this.setState({
                    user: data,
                });
            }
            success();
        }).fail((event, status, message) => {
            this.setState({
                user: {},
            });
            ApplicationActions.disconnect();
            ErrorActions.setMsgError(LoginTAG, message.Log);
            failed();
        });
    }

    onGetUsers(){
        const {user, users} = this.state;
        if (user.access&&(user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
        user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT')) ) {
            const query = 'users_info();';
            this.emit('query', {
                scope,
                query
            }).done((data) => {
                if (!deepEqual(data, users)){
                    this.setState({
                        users: data,
                    });
                }
            }).fail((event, status, message) => {
                this.setState({
                    users: [],
                });
                ErrorActions.setToastError(message.Log);
            });
        } else {
            this.setState({
                users: [],
            });
        }
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

    // TOKENS
    onDelExpired(tag){
        const query = 'del_expired(); users_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }


    // No need for GRANT rights hereafter.
    checkBeforeUserUpdate(q, tag, cb=()=>null) {
        const {user} = this.state;
        const ky = user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
                        user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ? 'users' : 'user';

        const query=`${q}; ${ky}_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                [ky]: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onGrant(name, collection, access, tag) {
        this.checkBeforeUserUpdate(`grant('${collection}', '${name}', ${access})`, tag);

    }

    onRevoke(name, collection, access, tag) {
        this.checkBeforeUserUpdate(`revoke('${collection}', '${name}', ${access})`, tag);
    }

    onPassword(name, password, tag, cb) {
        this.checkBeforeUserUpdate(`set_password('${name}', '${password}')`, tag, cb);

    }

    onResetPassword(name, tag, cb) {
        this.checkBeforeUserUpdate(`set_password('${name}', nil)`, tag, cb);
    }


    onNewToken(config, tag, cb){ // name [, expirationTime] [, description]
        this.checkBeforeUserUpdate(`new_token('${config.name}', expiration_time=${config.expirationTime||'nil'}, description='${config.description||''}')`, tag, cb);

    }

    onDelToken(key, tag){
        this.checkBeforeUserUpdate(`del_token('${key}')`, tag);

    }

}

export {ThingsdbActions, ThingsdbStore};