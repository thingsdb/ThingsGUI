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

    onGetCollections() {
        this.emit('/thingsdb/get_collections').done((data) => {
            this.setState({collections: data});
        }).fail((event, status, message) => ErrorActions.setToastError(message.log));
    }

    onGetCollection(name, tag) {
        this.emit('/thingsdb/get_collection', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onAddCollection(name, tag) {
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
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRenameCollection(oldname, newname, tag) {
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
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRemoveCollection(name, tag) {
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
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onSetQuota(name, quotaType, quota, tag) {
        this.emit('/thingsdb/set_quota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    //USERS

    onGetUsers(tag){
        this.emit('/user/get_users').done((data) => {
            this.setState({users: data});
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onGetUser(tag, config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setState({
                user: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }


    onAddUser(name, tag){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRemoveUser(name, tag) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRenameUser(oldname, newname, tag) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onPassword(name, password, tag) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onResetPassword(name, tag) {
        this.emit('/user/reset_password', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onGrant(name, collection, access, tag) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRevoke(name, collection, access, tag) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onNewToken(config, tag){ // name [, expirationTime] [, description]
        this.emit('/user/new_token', config).done((data) => {
            this.setState({
                users: data
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onDelToken(key){
        this.emit('/user/del_token', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
            return true;
        });
    }

    onDelExpired(){
        this.emit('/user/del_expired').done((data) => {
            this.setState({
                users: data
            });
            return true;
        });
    }
}

export {ThingsdbActions, ThingsdbStore};