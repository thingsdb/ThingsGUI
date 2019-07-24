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
    }

    onGetUsers(onError){
        this.emit('/user/getusers').done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onGetUser(name, onError){
        this.emit('/user/get', {
            name,
        }).done((data) => {
            this.setState({
                user: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onAddUser(name, password, onError){
        this.emit('/user/add', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onRemoveUser(name, onError) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }


    onRenameUser(oldname, newname, onError) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onPassword(name, password, onError) {
        emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onGrant(name, collection, access, onError) {
        emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onRevoke(name, collection, access, onError) {
        emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onNewToken(config, onError){ // name [, expirationTime] [, description]
        emit('/user/newtoken', config).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onDelToken(key, onError){
        emit('/user/deltoken', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onDelExpired(onError){
        emit('/user/delexpired').done((data) => {
            this.setState({
                users: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }
}

export {UsersActions, UsersStore};