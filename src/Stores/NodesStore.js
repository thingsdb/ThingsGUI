/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';


const NodesActions = {

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

export {NodesActions, useStore};
