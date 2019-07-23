import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const NodesActions = Vlow.createActions([
    'getNode',
    'setLoglevel',
    'setZone',
    'resetCounters',
    'shutdown',
]);

class NodesStore extends BaseStore {

    static types = {
        counters:
        nodes: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
    }

    static defaults = {
        counters: 
        nodes: [],
        node: {},
    }

    constructor() {
        super(NodesActions);
        this.state = NodesStore.defaults;
    }



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
