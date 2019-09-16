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

    onGetCollection(name, tag, cb) {
        this.emit('/thingsdb/get_collection', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onAddCollection(name, tag, cb) {
        const {user} = this.state;
        this.emit('/thingsdb/add', {
            name,
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
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onRenameCollection(oldname, newname, tag, cb) {
        const {user} = this.state;
        this.emit('/thingsdb/rename', {
            oldname,
            newname,
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
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onRemoveCollection(name, tag, cb) {
        const {user} = this.state;
        this.emit('/thingsdb/remove', {
            name,
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
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onSetQuota(name, quotaType, quota, tag, cb) {
        this.emit('/thingsdb/set_quota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    //USERS

    onGetUsers(tag, cb){
        this.emit('/user/get_users').done((data) => {
            this.setState({users: data});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onGetUser(tag, cb, config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setState({
                user: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }


    onAddUser(name, tag, cb){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onRemoveUser(name, tag, cb) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onRenameUser(oldname, newname, tag, cb) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onPassword(name, password, tag, cb) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onResetPassword(name, tag, cb) {
        this.emit('/user/reset_password', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onGrant(name, collection, access, tag, cb) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onRevoke(name, collection, access, tag, cb) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onNewToken(config, tag, cb){ // name [, expirationTime] [, description]
        this.emit('/user/new_token', config).done((data) => {
            this.setState({
                users: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);

        });
    }

    onDelToken(key){
        this.emit('/user/del_token', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelExpired(){
        this.emit('/user/del_expired').done((data) => {
            this.setState({
                users: data
            });
        });
    }
}

export {ThingsdbActions, ThingsdbStore};