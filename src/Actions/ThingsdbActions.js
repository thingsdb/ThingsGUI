import BaseActions from './BaseActions';

export default class ThingsdbStore extends BaseActions {
    getInfo() {
        this.emit('/thingsdb/get_info').done((data) => {
            this.setGlobal({
                collections: data.collections,
                users: data.users,
                user: data.user,
            });
        }).fail((event, status, message) => {
            this.setGlobal({
                error: message,
                collections: [],
                collection: {},
                users: [],
                user: {},
            });
        });
    }

    //COLLECTIONS

    getCollections() {
        this.emit('/thingsdb/getcollections').done((data) => {
            this.setGlobal({collections: data});
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    getCollection(name) {
        this.emit('/thingsdb/getcollection', {
            name,
        }).done((data) => {
            this.setGlobal({
                collection: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    addCollection(name) {
        const {user} = this.state;
        this.emit('/thingsdb/add', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setGlobal({
                    collections: data.collections,
                });
            }
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    renameCollection(oldname, newname) {
        const {user} = this.state;
        this.emit('/thingsdb/rename', {
            oldname,
            newname,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setGlobal({
                    collections: data.collections,
                });
            }
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    removeCollection(name) {
        const {user} = this.state;
        this.emit('/thingsdb/remove', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                this.setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                this.setGlobal({
                    collections: data.collections,
                });
            }
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    setQuota(name, quotaType, quota) {
        this.emit('/thingsdb/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setGlobal({
                collections: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    //USERS

    getUsers(){
        this.emit('/user/getusers').done((data) => {
            this.setGlobal({users: data});
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    getUser(config=null){
        this.emit('/user/get', {
            config,
        }).done((data) => {
            this.setGlobal({
                user: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }


    addUser(name){
        this.emit('/user/add', {
            name,
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    removeUser(name) {
        this.emit('/user/remove', {
            name
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }


    renameUser(oldname, newname) {
        this.emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    password(name, password) {
        this.emit('/user/password', {
            name,
            password,
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    resetPassword(name) {
        this.emit('/user/reset-password', {
            name,
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    grant(name, collection, access) {
        this.emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setGlobal({users: data});
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    revoke(name, collection, access) {
        this.emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            this.setGlobal({users: data});
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    newToken(config){ // name [, expirationTime] [, description]
        this.emit('/user/newtoken', config).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    delToken(key){
        this.emit('/user/deltoken', {
            key,
        }).done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }

    delExpired(){
        this.emit('/user/delexpired').done((data) => {
            this.setGlobal({
                users: data
            });
        }).fail((event, status, message) => this.setGlobal({error: message}));
    }
}
