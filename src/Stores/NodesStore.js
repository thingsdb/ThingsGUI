import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const NodesActions = Vlow.createActions([
    'getNodes',
    'getNode',
    'setLoglevel',
    'setZone',
    'resetCounters',
    'shutdown',
    'addNode',
    'popNode',
    'replaceNode',
]);

class NodesStore extends BaseStore {

    static types = {
        counters: PropTypes.object,
        nodes: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
    }

    static defaults = {
        counters: {}, 
        nodes: [],
        node: {},
    }

    constructor() {
        super(NodesActions);
        this.state = NodesStore.defaults;
    }

    onGetNodes(){
        this.emit('/user/getnodes').done((data) => {
            this.setState({
                nodes: data.nodes
            });
        });
    }

    onGetNode(node) {
        this.emit('/node/get', {
            node,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        });
    }

    onSetLoglevel(node, level) {
        this.emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        });
    }

    setZone(node, zone) {
        this.emit('/node/zone', {
            node: node.node_id,
            zone,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        });
    }

    resetCounters(node) {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.counters
            });
        });
    }

    shutdown(node) {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        });
    }









    
};

export {NodesActions, NodesStore};
