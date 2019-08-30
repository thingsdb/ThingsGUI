import { emit } from './BaseActions';
import { getGlobal, setGlobal } from 'reactn';

const ThingsdbActions = {

    getInfo: () => {
        emit('/thingsdb/get_info').done((data) => {
            setGlobal({
                collections: data.collections,
                users: data.users,
                user: data.user,
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    //COLLECTIONS

    getCollections: () => {
        emit('/thingsdb/getcollections').done((data) => {
            setGlobal({collections: data});
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    getCollection: (name) => {
        emit('/thingsdb/getcollection', {
            name,
        }).done((data) => {
            setGlobal({
                collection: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    addCollection: (name) => {
        const user = getGlobal().user;
        emit('/thingsdb/add', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                setGlobal({
                    collections: data.collections,
                });
            }
            console.log(getGlobal().collections, getGlobal().users);
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    renameCollection: (oldname, newname) => {
        const user = getGlobal().user;
        emit('/thingsdb/rename', {
            oldname,
            newname,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                setGlobal({
                    collections: data.collections,
                });
            }
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    removeCollection: (name) => {
        const user = getGlobal().user;
        emit('/thingsdb/remove', {
            name,
        }).done((data) => {
            if (user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
            user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                setGlobal({
                    collections: data.collections,
                    users: data.users,
                });
            }
            else {
                setGlobal({
                    collections: data.collections,
                });
            }
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    setQuota: (name, quotaType, quota) => {
        emit('/thingsdb/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            setGlobal({
                collections: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    //USERS

    getUsers: () => {
        emit('/user/getusers').done((data) => {
            setGlobal({users: data});
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    getUser: (config=null) => {
        emit('/user/get', {
            config,
        }).done((data) => {
            setGlobal({
                user: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },


    addUser: (name) => {
        emit('/user/add', {
            name,
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    removeUser: (name) =>  {
        emit('/user/remove', {
            name
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },


    renameUser: (oldname, newname) => {
        emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    password: (name, password) => {
        emit('/user/password', {
            name,
            password,
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    resetPassword: (name) =>  {
        emit('/user/reset-password', {
            name,
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    grant: (name, collection, access) => {
        emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            setGlobal({users: data});
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    revoke: (name, collection, access) => {
        emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            setGlobal({users: data});
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    newToken: (config) => { // name [, expirationTime] [, description]
        emit('/user/newtoken', config).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    delToken: (key) => {
        emit('/user/deltoken', {
            key,
        }).done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },

    delExpired: () => {
        emit('/user/delexpired').done((data) => {
            setGlobal({
                users: data
            });
        }).fail((event, status, message) => setGlobal({error: message}));
    },
};


export default ThingsdbActions;
