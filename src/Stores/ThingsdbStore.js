import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

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
        }).fail(() => {
            this.setState({
                collections: [],
                collection: {},
                users: [],
                user: {},
            });
        });
    }

    //COLLECTIONS

    onGetCollections() {
        this.emit('/thingsdb/getcollections').done((data) => {
            this.setState({collections: data});
        });
    }

    onGetCollection(name) {
        this.emit('/thingsdb/getcollection', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
        });
    }

    onAddCollection(name) {
        const {user} = this.state;
        this.emit('/thingsdb/add', {
            name,
        }).done((data) => {
            this.setState({
                collections: data.collections,
            });

            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    users: data.users,
                });
            }
        });
    }

    onRenameCollection(oldname, newname) {
        const {user} = this.state;
        this.emit('/thingsdb/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                collections: data.collections,
            });

            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    users: data.users,
                });
            }
        });
    }

    onRemoveCollection(name) {
        const {user} = this.state;
        this.emit('/thingsdb/remove', {
            name,
        }).done((data) => {
            this.setState({
                collections: data.collections,
            });

            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setState({
                    users: data.users,
                });
            }
        });
    }

    onSetQuota(name, quotaType, quota) {
        this.emit('/thingsdb/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
        });
    }

    //USERS

    onGetUsers(){
        this.emit('/user/getusers').done((data) => {
            this.setState({users: data});
        });
    }

    onGetUser(config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setState({
                user: data
            });
        });
    }


    onAddUser(name){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onRemoveUser(name) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }


    onRenameUser(oldname, newname) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onPassword(name, password) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onResetPassword(name) {
        this.emit('/user/reset-password', {
            name,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onGrant(name, collection, access) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
        });
    }

    onRevoke(name, collection, access) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({users: data});
        });
    }

    onNewToken(config){ // name [, expirationTime] [, description]
        this.emit('/user/newtoken', config).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelToken(key){
        this.emit('/user/deltoken', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelExpired(){
        this.emit('/user/delexpired').done((data) => {
            this.setState({
                users: data
            });
        });
    }
}

export {ThingsdbActions, ThingsdbStore};