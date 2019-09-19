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
        this.emit('getInfo').done((data) => {
            console.log(data);
            this.setState({
                collections: data.Collections,
                users: data.Users,
                user: data.User,
            });
        }).fail((event, status, message) => {
            this.setState({
                collections: [],
                collection: {},
                users: [],
                user: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    //COLLECTIONS

    onGetCollections() {
        this.emit('getCollections').done((data) => {
            this.setState({collections: data.Collections});
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetCollection(name, tag, cb) {
        this.emit('getCollection', {
            name,
        }).done((data) => {
            this.setState({
                collection: data.Collection
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onAddCollection(name, tag, cb) {
        const {user} = this.state;
        this.emit('newCollection', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.Collections,
                    users: data.Users,
                });
            }
            else {
                this.setState({
                    collections: data.Collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRenameCollection(oldname, newname, tag, cb) {
        const {user} = this.state;
        this.emit('renameCollection', {
            oldname,
            newname,
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.Collections,
                    users: data.Users,
                });
            }
            else {
                this.setState({
                    collections: data.Collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRemoveCollection(name, tag, cb) {
        const {user} = this.state;
        this.emit('delCollection', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.scope==='@thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.scope==='@thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    collections: data.Collections,
                    users: data.Users,
                });
            }
            else {
                this.setState({
                    collections: data.Collections,
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onSetQuota(name, quotaType, quota, tag, cb) {
        this.emit('setQuota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data.Collections
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    //USERS

    onGetUsers(tag, cb){
        this.emit('/user/get_users').done((data) => {
            this.setState({users: data.Users});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onGetUser(tag, cb, config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setState({
                user: data.User
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }


    onAddUser(name, tag, cb){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRemoveUser(name, tag, cb) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRenameUser(oldname, newname, tag, cb) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onPassword(name, password, tag, cb) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onResetPassword(name, tag, cb) {
        this.emit('/user/reset_password', {
            name,
        }).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onGrant(name, collection, access, tag, cb) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data.Users});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onRevoke(name, collection, access, tag, cb) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data.Users});
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onNewToken(config, tag, cb){ // name [, expirationTime] [, description]
        this.emit('/user/new_token', config).done((data) => {
            this.setState({
                users: data.Users
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }

    onDelToken(key){
        this.emit('/user/del_token', {
            key,
        }).done((data) => {
            this.setState({
                users: data.Users
            });
        });
    }

    onDelExpired(){
        this.emit('/user/del_expired').done((data) => {
            this.setState({
                users: data.Users
            });
        });
    }
}

export {ThingsdbActions, ThingsdbStore};