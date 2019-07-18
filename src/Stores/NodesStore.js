/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import {emit, useStore} from './BaseStore';


const NodesActions = {
    nodes: (dispatch) => () => {
        emit('/nodes', {
        }).done((data) => dispatch((state) => {
            return {nodes: data};
        }));
    },
    getNode: (dispatch, node) => () => {
        emit('/node/get', {
            node,
        }).done((data) => dispatch((state) => {
            return data;
        }));
    },
    setLoglevel: (dispatch, node, level) => () => {
        emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => dispatch((state) => {
            return data;
        }));
    },
    setZone: (dispatch, node, zone) => () => {
        emit('/node/zone', {
            node: node.node_id,
            zone,
        }).done((data) => dispatch((state) => {
            return data;
        }));
    },
    resetCounters: (dispatch, node) => () => {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => dispatch((state) => {
            return data;
        }));
    },
    shutdown: (dispatch, node) => () => {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => dispatch((state) => {
            //TODOK
        }));
    },

};

const initialState = {
    nodes: [],
    node: null,
    counters: null,
};

const StoreContext = React.createContext(initialState);

const useNodes = () => {
    const {state, dispatch} = React.useContext(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

const NodesProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

NodesProvider.propTypes = {
    children: PropTypes.node,
};

NodesProvider.defaultProps = {
    children: null,
};

export {NodesActions, NodesProvider, useNodes};