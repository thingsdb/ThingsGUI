import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import { ApplicationActions } from './ApplicationStore';
import { LoginTAG } from '../Constants/Tags';
import { THINGSDB_SCOPE } from '../Constants/Scopes';
import {
    DEL_TOKEN_ARGS,
    GRANT_REVOKE_ARGS,
    NAME_ARGS,
    NEW_TOKEN_ARGS,
    RENAME_ARGS,
    SET_PASSWORD_ARGS,
} from '../TiQueries/Arguments';
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
    REVOKE_QUERY,
    SET_PASSWORD_QUERY,
    USER_INFO_QUERY,
    USERS_INFO_QUERY,
} from '../TiQueries/Queries';

const scope = THINGSDB_SCOPE;

const ThingsdbActions = Vlow.factoryActions<ThingsdbStore>()([
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
] as const);


class ThingsdbStore extends BaseStore<IThingsdbStore> {

    static types = {
        collections: PropTypes.arrayOf(PropTypes.object),
        collection: PropTypes.object,
        users: PropTypes.arrayOf(PropTypes.object),
        user: PropTypes.object,
    };

    static defaults: IThingsdbStore = {
        collections: [],
        // @ts-expect-error
        collection: {},
        users: [],
        // @ts-expect-error
        user: {},
    };

    constructor() {
        super(ThingsdbActions);
        this.state = ThingsdbStore.defaults;
    }

    onResetThingsStore() {
        this.setState({
            collections: [],
            // @ts-expect-error
            collection: {},
            users: [],
            // @ts-expect-error
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
                // @ts-expect-error
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

    returnCollectionsUser(scope: string, query: string, args: object, tag: string, cb: () => void) {
        const {collections} = this.state;
        this.emit('query', {
            scope,
            query,
            arguments: args
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

    returnCollectionsUsers(scope: string, query: string, args: object, tag: string, cb: () => void) {
        const {collections, users} = this.state;
        this.emit('query', {
            scope,
            query,
            arguments: args
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

    checkBeforeCollectionUpdate(q: string, args: object, tag: string, cb=()=>{}) {
        const {user} = this.state;
        if (user.access.find(a => a.scope===scope).privileges.includes('FULL') ||
        user.access.find(a => a.scope===scope).privileges.includes('GRANT') ) {
            const query = q + ' ' + COLLECTIONS_USERS_INFO_QUERY;
            this.returnCollectionsUsers(scope, query, args, tag, cb);
        } else {
            const query = q + ' ' + COLLECTIONS_USER_INFO_QUERY;
            this.returnCollectionsUser(scope, query, args, tag, cb);
        }
    }

    onAddCollection(name: string, tag: string, cb: () => void) {
        this.checkBeforeCollectionUpdate(
            NEW_COLLECTION_QUERY,
            NAME_ARGS(name),
            tag,
            cb
        );
    }

    onRenameCollection(current: string, newName: string, tag: string, cb: () => void) {
        this.checkBeforeCollectionUpdate(
            RENAME_COLLECTION_QUERY,
            RENAME_ARGS(current, newName),
            tag,
            cb
        );
    }

    onRemoveCollection(name: string, tag: string, cb: () => void) {
        this.checkBeforeCollectionUpdate(
            DEL_COLLECTION_QUERY,
            NAME_ARGS(name),
            tag,
            cb
        );
    }

    //USERS

    onGetUser(success=()=>{}, failed=()=>{}){
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
                // @ts-expect-error
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

    onAddUser(name: string, tag: string, cb: () => void){
        const query = NEW_USER_QUERY + ' ' + USERS_INFO_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            scope,
            query,
            arguments: jsonArgs
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRemoveUser(name: string, tag: string, cb: () => void) {
        const query = DEL_USER_QUERY + ' ' + USERS_INFO_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            scope,
            query,
            arguments: jsonArgs
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameUser(current: string, newName: string, tag: string, cb: () => void) {
        const query = RENAME_USER_QUERY + ' ' + USERS_INFO_QUERY;
        const jsonArgs = RENAME_ARGS(current, newName);
        this.emit('query', {
            scope,
            query,
            arguments: jsonArgs
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
    onDelExpired(tag: string){
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
    checkBeforeUserUpdate(q: string, args: object, tag: string, cb=()=>{}) {
        const {user} = this.state;
        const ky = user.access.find(a => a.scope===scope).privileges.includes('FULL') ||
                        user.access.find(a => a.scope===scope).privileges.includes('GRANT') ? 'users' : 'user';

        const query = q + ' ' + INFO_QUERY(ky);
        this.emit('query', {
            scope,
            query,
            arguments: args
        }).done((data) => {
            this.setState({
                [ky]: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onGrant(name: string, collection: string, access: number, tag: string) {
        this.checkBeforeUserUpdate(
            GRANT_QUERY,
            GRANT_REVOKE_ARGS(collection, name, access),
            tag
        );

    }

    onRevoke(name: string, collection: string, access: number, tag: string) {
        this.checkBeforeUserUpdate(
            REVOKE_QUERY,
            GRANT_REVOKE_ARGS(collection, name, access),
            tag
        );
    }

    onPassword(name: string, password: string, tag: string, cb: () => void) {
        this.checkBeforeUserUpdate(
            SET_PASSWORD_QUERY,
            SET_PASSWORD_ARGS(name, password),
            tag,
            cb
        );

    }

    onResetPassword(name: string, tag: string, cb: () => void) {
        this.checkBeforeUserUpdate(
            SET_PASSWORD_QUERY,
            SET_PASSWORD_ARGS(name, null),
            tag,
            cb
        );
    }


    onNewToken(config: any, tag: string, cb: () => void){ // name [, expirationTime] [, description]
        this.checkBeforeUserUpdate(
            NEW_TOKEN_QUERY(config.description),
            NEW_TOKEN_ARGS(config.name, config.expirationTime || null, config.description),
            tag,
            cb
        );

    }

    onDelToken(key: string, tag: string){
        this.checkBeforeUserUpdate(
            DEL_TOKEN_QUERY,
            DEL_TOKEN_ARGS(key),
            tag
        );

    }

}

export {ThingsdbActions, ThingsdbStore};

declare global {
    interface ICollection {
        created_at: number;
        collection_id: number;
        name: string;
        things: any;
    }

    interface IUser {
        created_at: number;
        name: string;
        access: any[];
        tokens: any[];
        has_password: boolean;
    }

    interface IThingsdbStore {
        collections: ICollection[];
        collection: ICollection;
        users: IUser[];
        user: IUser;
    }
}