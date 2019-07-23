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

    onGetUsers(){
        this.emit('/user/getusers').done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onGetUser({name}){
        this.emit('/user/get', {
            name,
        }).done((data) => {
            this.setState({
                user: data
            });
        });
    }

    onAddUser({name, password}){
        this.emit('/user/add', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onRemoveUser({name}) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }


    onRenameUser({oldname, newname}) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onPassword({name, password}) {
        emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onGrant({name, collection, access}) {
        emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onRevoke({name, collection, access}) {
        emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onNewToken(config){ // name [, endtime] [, description]
        emit('/user/newtoken', config).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelToken({key}){
        emit('/user/deltoken', {
            key,
        }).done((data) => {
            this.setState({
                users: data
            });
        });
    }

    onDelExpired(){
        emit('/user/delexpired').done((data) => {
            this.setState({
                users: data
            });
        });
    }
}

export {UsersActions, UsersStore};