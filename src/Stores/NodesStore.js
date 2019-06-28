/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';

const nodesInitialState = {
};

const NodesActions = {
    
    node: (dispatch, node) => () => {
        emit('/node/get', {
            node,
        }).done((data) => dispatch((state) => {
            const {nodesLookup} = state;
            nodesLookup[node] = data;
            return {nodesLookup};
        }));
    },
    setLoglevel: (dispatch, node, level) => () => {
        emit('/node/loglevel', {
            node: node.node_id, 
            level,
        }).done((data) => dispatch((state) => {
            // const {nodesLookup} = this.state;
            // nodesLookup[node.node_id].node = data.node;
            // return {nodesLookup};
            return data;
        }));
    },
    setZone: (dispatch, node, zone) => () => {
        emit('/node/zone', {
            node: node.node_id, 
            zone,
        }).done((data) => dispatch((state) => {
            // const {nodesLookup} = this.state;
            // nodesLookup[node.node_id].node = data.node;
            // return {nodesLookup};
            return data;
        }));
    },
    resetCounters: (dispatch, node) => () => {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => dispatch((state) => {
            // const {nodesLookup} = this.state;
            // nodesLookup[node.node_id].counters = data.counters;
            // return {nodesLookup};
            return data;
        }));
    },
    shutdown: (dispatch, node) => () => {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => dispatch((state) => {
            //TODOK
            // this._onDisconnect();
        }));
    },

};

export {NodesActions, nodesInitialState, useStore};
