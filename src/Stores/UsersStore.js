import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const UsersActions = Vlow.createActions([
    'getUsers',
    'getUser',
    'addUser',
    'removeUser',
    'renameUser',
    'password',
    'grant',
    'revoke',
    'newToken',
    'delToken',
    'delExpired',
]);

// TODO: CALLBACKS
class UsersStore extends BaseStore {

    static types = {
        users: PropTypes.arrayOf(PropTypes.object),
        user: PropTypes.object,
    }

    static defaults = {
        users: [],
        user: {},
    }

    constructor() {
        super(UsersActions);
        this.state = UsersStore.defaults;
        this.onGetUsers();
    }

    onGetUsers(){
        this.emit('/user/getusers').done((data) => {
            this.setState({users: data});
        });
    }

    onGetUser(name, onError){
        this.emit('/user/get', {
            name,
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

    onGrant(name, collection, access, onError) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onRevoke(name, collection, access, onError) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
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

export {UsersActions, UsersStore};