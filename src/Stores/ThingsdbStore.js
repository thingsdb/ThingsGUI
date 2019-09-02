import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';

const ThingsdbActions = Vlow.createActions([

    //COLLECTIONS ACTIONS
    'getInfo',
    'getCollections',
    'getCollection',
    'addCollection',
    'renameCollection',
    'removeCollection',
    'setQuota',

    //USER ACTIONS
    'getUsers',
    'getUser',
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

    onGetInfo() {
        this.emit('/thingsdb/get_info').done((data) => {
            this.setState({
                collections: data.collections,
                users: data.users,
                user: data.user,
            });
        }).fail((event, status, message) => {
            this.setState({
                collections: [],
                collection: {},
                users: [],
                user: {},
            });
            ErrorActions.setToastError(message.log);
        });
    }

    //COLLECTIONS

    onGetCollections(onError) {
        this.emit('/thingsdb/getcollections').done((data) => {
            this.setState({collections: data});
        }).fail((event, status, message) => onError(message));
    }

    onGetCollection(name, onError) {
        this.emit('/thingsdb/getcollection', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onAddCollection(name, onError) {
        const {user} = this.state;
        this.emit('/thingsdb/add', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
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
        }).fail((event, status, message) => onError(message));
    }

    onRenameCollection(oldname, newname, onError) {
        const {user} = this.state;
        this.emit('/thingsdb/rename', {
            oldname,
            newname,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
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
        }).fail((event, status, message) => onError(message));
    }

    onRemoveCollection(name, onError) {
        const {user} = this.state;
        this.emit('/thingsdb/remove', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
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
        }).fail((event, status, message) => onError(message));
    }

    onSetQuota(name, quotaType, quota, onError) {
        this.emit('/thingsdb/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((event, status, message) => onError(message));
    }

    //USERS

    onGetUsers(onError){
        this.emit('/user/getusers').done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => onError(message));
    }

    onGetUser(onError, config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setState({
                user: data
            });
        }).fail((event, status, message) => onError(message));
    }


    onAddUser(name, onError){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onRemoveUser(name, onError) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }


    onRenameUser(oldname, newname, onError) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onPassword(name, password, onError) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onResetPassword(name, onError) {
        this.emit('/user/reset-password', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onGrant(name, collection, access, onError) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => onError(message));
    }

    onRevoke(name, collection, access, onError) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
        }).fail((event, status, message) => onError(message));
    }

    onNewToken(config, onError){ // name [, expirationTime] [, description]
        this.emit('/user/newtoken', config).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onDelToken(key, onError){
        this.emit('/user/deltoken', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onDelExpired(onError){
        this.emit('/user/delexpired').done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }
}

export {ThingsdbActions, ThingsdbStore};