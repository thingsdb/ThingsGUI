/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';

const appInitialState = {
    loaded: true,
    connected: false,
    connErr: '',
    match: {},

    collections: [],
    nodes: [],
    users: [],
    node: {},
    counters: [],
    nodesLookup: {},

    collection: null,
};

const AppActions = {
    connect: (dispatch, {host, user, password}) => () => {
        emit('/connect', {
            host,
            user,
            password,
        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            // data.match = {path: 'collection', collection: data.collections[0]}
            // data.match = {path: 'nodes', node: data.nodes[0]}
            return data;
        }));
    },
    disconnect: (dispatch) => () => {
        emit('/disconnect', {

        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            return {
                connected: false,
                connErr: '',
                match: {},
                collections: [],
                nodes: [],
                users: [],
                node: {},
                nodesLookup: {},
            };
        }));
    },
    navigate: (dispatch, {path}) => () => {
        dispatch((state) => {
            // window.console.log('...', state);
            return {match: {path}};
        });
    },


    addCollection: (dispatch, name) => () => {
        emit('/collection/add', {
            name,
        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            state.collections.push({collection_id: data, name});
            return state;
        }));
    },
    renameCollection: (dispatch, collection, name) => () => {
        emit('/collection/rename', {
            collection,
            name,
        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            const updated = state.collections.find((c) => c.name === collection);
            updated.name = name;
            return state;
        }));
    },
    removeCollection: (dispatch, collection) => () => {
        emit('/collection/remove', {
            collection,
        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            state.collections = state.collections.filter((c) => c.name !== collection);
            return state;
        }));
    },
    setQuota: (dispatch, collection, quotaType, quota) => () => {
        emit('/collection/setquota', {
            collection,
            quotaType,
            quota,
        }).done((data) => dispatch((state) => {
            window.console.log('...', state, data);
            const updated = state.collections.find((c) => c.name === collection);
            updated[`quota_${quotaType}`] = quota;
            return state;
        }));
    },

    addUser: (dispatch, name, password) => () => {
        emit('/user/add', {
            name,
            password,
        }).done((data) => dispatch((state) => {
            state.users.push({user_id: data, name}); // TODOK privileges
            return state;
        }));
    },
    removeUser: (dispatch, user) => () => {
        emit('/user/remove', {
            name
        }).done((data) => dispatch((state) => {
            // TODOK this._fetch();
            state.users = state.users.filter((u) => u.name !== user);
            return state;
        }));
    },
    renameUser: (dispatch, user, name) => () => {
        emit('/user/rename', {
            user,
            name,
        }).done((data) => dispatch((state) => {
            const updated = state.users.find((u) => u.name === user);
            updated.name = name;
            return state;
        }));
    },
    password: (dispatch, user, password) => () => {
        emit('/user/password', {
            user,
            password,
        }).done((data) => dispatch((state) => {
            // TODOK this._fetch();
        }));
    },
    grant: (dispatch, user, collection, access) => () => {
        emit('/grant', {
            collection,
            user,
            access,
        }).done((data) => dispatch((state) => {
            const updated = state.users.find((u) => u.name === user);
            const updateda = updated.access.find((a) => a.target === collection);
            if (updateda) {
                updateda.privileges = access;
            } else {
                updated.access.push({target: collection, privileges: access});
            }
            return state;
        }));
    },
    revoke: (dispatch, user, collection, access) => () => {
        emit('/revoke', {
            collection,
            user,
            access,
        }).done((data) => dispatch((state) => {
            const updated = state.users.find((u) => u.name === user);
            updated.access = updated.access.filter((a) => a.target !== collection);
            return state;
        }));
    }
};

export {AppActions, appInitialState, useStore};