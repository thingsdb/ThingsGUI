
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import { ApplicationActions } from './ApplicationStore';
import { LoginTAG } from '../Constants/Tags';
import { THINGSDB_SCOPE } from '../Constants/Scopes';
import {
    COLLECTION_INFO_QUERY,
    COLLECTIONS_INFO_QUERY,
    COLLECTIONS_USER_INFO_QUERY,
    COLLECTIONS_USERS_INFO_QUERY,
    DEL_COLLECTION_QUERY,
    DEL_EXPIRED_QUERY,
    DEL_TOKEN_QUERY,
    DEL_USER_QUERY,
    GRANT_QUERY,
    INFO_QUERY,
    NEW_COLLECTION_QUERY,
    NEW_TOKEN_QUERY,
    NEW_USER_QUERY,
    RENAME_COLLECTION_QUERY,
    RENAME_USER_QUERY,
    RESET_PASSWORD_QUERY,
    REVOKE_QUERY,
    SET_PASSWORD_QUERY,
    USER_INFO_QUERY,
    USERS_INFO_QUERY,
} from '../TiQueries';

const scope = THINGSDB_SCOPE;

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
        const query = COLLECTION_INFO_QUERY;
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
        const query = COLLECTIONS_INFO_QUERY;
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
            const [freshCollections, freshUsers] = data;
            if (!deepEqual(freshCollections, collections) || !deepEqual(freshUsers, users)){
                this.setState({
                    collections: freshCollections,
                    users: freshUsers,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    checkBeforeCollectionUpdate(q, tag, cb=()=>null) {
        const {user} = this.state;
        if (user.access.find(a => a.scope===scope).privileges.includes('FULL') ||
        user.access.find(a => a.scope===scope).privileges.includes('GRANT') ) {
            const query = q + ' ' + COLLECTIONS_USERS_INFO_QUERY;
            this.returnCollectionsUsers(scope, query, tag, cb);
        } else {
            const query = q + ' ' + COLLECTIONS_USER_INFO_QUERY;
            this.returnCollectionsUser(scope, query, tag, cb);
        }
    }

    onAddCollection(name, tag, cb) {
        this.checkBeforeCollectionUpdate(NEW_COLLECTION_QUERY(name), tag, cb);
    }

    onRenameCollection(oldName, newName, tag, cb) {
        this.checkBeforeCollectionUpdate(RENAME_COLLECTION_QUERY(oldName, newName), tag, cb);
    }

    onRemoveCollection(name, tag, cb) {
        this.checkBeforeCollectionUpdate(DEL_COLLECTION_QUERY(name), tag, cb);
    }

    //USERS

    onGetUser(success=()=>null, failed=()=>null){
        const {user} = this.state;
        const query = USER_INFO_QUERY;
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
        if (user.access&&(user.access.find(a => a.scope===scope).privileges.includes('FULL') ||
        user.access.find(a => a.scope===scope).privileges.includes('GRANT')) ) {
            const query = USERS_INFO_QUERY;
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
        const query = NEW_USER_QUERY(name) + ' ' + USERS_INFO_QUERY;
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
        const query = DEL_USER_QUERY(name) + ' ' + USERS_INFO_QUERY;
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

    onRenameUser(oldName, newName, tag, cb) {
        const query = RENAME_USER_QUERY(oldName, newName) + ' ' + USERS_INFO_QUERY;
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
        const query = DEL_EXPIRED_QUERY + ' ' + USERS_INFO_QUERY;
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
        const ky = user.access.find(a => a.scope===scope).privileges.includes('FULL') ||
                        user.access.find(a => a.scope===scope).privileges.includes('GRANT') ? 'users' : 'user';

        const query = q + ' ' + INFO_QUERY(ky);
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
        this.checkBeforeUserUpdate(GRANT_QUERY(collection, name, access), tag);

    }

    onRevoke(name, collection, access, tag) {
        this.checkBeforeUserUpdate(REVOKE_QUERY(collection, name, access), tag);
    }

    onPassword(name, password, tag, cb) {
        this.checkBeforeUserUpdate(SET_PASSWORD_QUERY(name, password), tag, cb);

    }

    onResetPassword(name, tag, cb) {
        this.checkBeforeUserUpdate(RESET_PASSWORD_QUERY(name), tag, cb);
    }


    onNewToken(config, tag, cb){ // name [, expirationTime] [, description]
        this.checkBeforeUserUpdate(NEW_TOKEN_QUERY(config.name, config.expirationTime, config.description), tag, cb);

    }

    onDelToken(key, tag){
        this.checkBeforeUserUpdate(DEL_TOKEN_QUERY(key), tag);

    }

}

export {ThingsdbActions, ThingsdbStore};