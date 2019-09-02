import {emit, useStore} from './BaseActions';

const ThingsdbActions = {

    getInfo: (dispatch) => {
        emit('/thingsdb/get_info').done((data) => {
            dispatch(() => {
                return {
                    collections: data.collections,
                    users: data.users,
                    user: data.user,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    //COLLECTIONS

    getCollections: (dispatch) => {
        emit('/thingsdb/getCollection(dispatch)s').done((data) => {
            dispatch(() => {
                return {collections: data};
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    getCollection: (dispatch, name) => {
        emit('/thingsdb/getCollection(dispatch)', {
            name,
        }).done((data) => {
            dispatch(() => {
                return {
                    collection: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },
    addCollection: (dispatch, name) => {
        emit('/thingsdb/add', {
            name,
        }).done((data) => {
            dispatch((state) => {
                if (state.user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
                state.user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                    return{
                        collections: data.collections,
                        users: data.users,
                    };
                }
                else {
                    return{
                        collections: data.collections,
                    };
                }
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    renameCollection: (dispatch, oldname, newname) => {
        emit('/thingsdb/rename', {
            oldname,
            newname,
        }).done((data) => {
            dispatch((state) => {
                if (state.user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
                state.user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                    return{
                        collections: data.collections,
                        users: data.users,
                    };
                }
                else {
                    return{
                        collections: data.collections,
                    };
                }
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    removeCollection: (dispatch, name) => {
        emit('/thingsdb/remove', {
            name,
        }).done((data) => {
            dispatch((state) => {
                if (state.user.access.find(a => a.target==='.thingsdb').privileges.includes('FULL') ||
                state.user.access.find(a => a.target==='.thingsdb').privileges.includes('GRANT') ) {
                    return{
                        collections: data.collections,
                        users: data.users,
                    };
                }
                else {
                    return{
                        collections: data.collections,
                    };
                }
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    setQuota: (dispatch, name, quotaType, quota) => {
        emit('/thingsdb/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            dispatch(() => {
                return {
                    collections: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    //USERS

    getUsers: (dispatch) => {
        emit('/user/getusers').done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    getUser: (dispatch, config=null) => {
        emit('/user/get', {
            config,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },


    addUser: (dispatch, name) => {
        emit('/user/add', {
            name,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    removeUser: (dispatch, name) =>  {
        emit('/user/remove', {
            name
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },


    renameUser: (dispatch, oldname, newname) => {
        emit('/user/rename', {
            oldname,
            newname,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    password: (dispatch, name, password) => {
        emit('/user/password', {
            name,
            password,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    resetPassword: (dispatch, name) =>  {
        emit('/user/reset-password', {
            name,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    grant: (dispatch, name, collection, access) => {
        emit('/user/grant', {
            collection,
            name,
            access,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    revoke: (dispatch, name, collection, access) => {
        emit('/user/revoke', {
            collection,
            name,
            access,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    newToken: (dispatch, config) => { // name [, expirationTime] [, description]
        emit('/user/newtoken', config).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    delToken: (dispatch, key) => {
        emit('/user/deltoken', {
            key,
        }).done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    delExpired: (dispatch) => {
        emit('/user/delexpired').done((data) => {
            dispatch(() => {
                return {
                    users: data
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },
};


export {ThingsdbActions, useStore};
