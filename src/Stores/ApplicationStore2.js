/* eslint-disable no-unused-vars */
import React from 'react';
import {emit} from './BaseStore';

const AppStore = () => {
    const [store, setStore] = React.useState({loaded: false, connected: false, match: {}});
    return {
        store,
        actions: {
            connected: () => () => {
                emit('/connected', {
                }).done((data) => {
                    const updated = Object.assign({}, store, data);
                    setStore(updated);
                    // dispatch((state) => {
                    //     return data;
                    // });
                });
            },
            connect: ({host, user, password}) => () => {
                emit('/connect', {
                    host,
                    user,
                    password,
                }).done((data) => {
                    const updated = Object.assign({}, store, data);
                    setStore(updated);
                    // dispatch((state) => {
                    //     // window.console.log('...', state, data);
                    //     // data.match = {path: 'collection', collection: data.collections[0]}
                    //     // data.match = {path: 'nodes', node: data.nodes[0]}
                    //     return data;
                    // });
                });
            },
            connectOther: (dispatch, {host}) => () => {
                emit('/connect/other', {
                    host,
                }).done((data) => dispatch((state) => {
                    // window.console.log('...', state, data);
                    // data.match = {path: 'collection', collection: data.collections[0]}
                    // data.match = {path: 'nodes', node: data.nodes[0]}
                    return data;
                }));
            },
            disconnect: (dispatch) => () => {
                emit('/disconnect', {

                }).done((data) => {
                    const updated = {
                        connected: false,
                        connErr: '',
                        match: {},
                        collections: [],
                        nodes: [],
                        users: [],
                    };
                    setStore(updated);
                    // dispatch((state) => {
                    //     // window.console.log('...', state, data);
                    //     return {
                    //         connected: false,
                    //         connErr: '',
                    //         match: {},
                    //         collections: [],
                    //         nodes: [],
                    //         users: [],
                    //     };
                    // });
                });
            },
            navigate: ({path}) => () => {
                const updated = Object.assign({}, store, {match: {path}});
                setStore(updated);
                // dispatch((state) => {
                //     // window.console.log('...', state);
                //     return {match: {path}};
                // });
            },
        }
    };
};

const AppContext = React.createContext();

export {AppStore, AppContext};