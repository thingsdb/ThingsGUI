/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';

const AppActions = {
    connected: (dispatch) => () => {
        emit('/connected', {
        }).done((data) => dispatch((state) => {
            return data;
        }));
    },
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

        }).done((data) => dispatch((state) => {
            // window.console.log('...', state, data);
            return {
                connected: false,
                connErr: '',
                match: {},
                collections: [],
                nodes: [],
                users: [],
            };
        }));
    },
    navigate: (dispatch, {path}) => () => {
        dispatch((state) => {
            // window.console.log('...', state);
            return {match: {path}};
        });
    },
};

export {AppActions, useStore};