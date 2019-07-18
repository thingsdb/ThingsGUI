/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import {emit} from './BaseStore';


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

const initialState = {
    loaded: false,
    connected: false,
    connErr: '',
    match: {},

    // collections: [],
    // nodes: [],
    // users: [],
    // node: null,
    // counters: null,
    collection: null,
    things: {},
};

const StoreContext = React.createContext(initialState);

const useStore = () => {
    const { state, dispatch } = React.useContext(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node,
};

AppProvider.defaultProps = {
    children: null,
};

export {AppActions, AppProvider, useStore};