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

// TODO: CALLBACKS
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
        this.onGetNodes();
    }

    onGetNodes(){
        this.emit('/user/getnodes').done((data) => {
            this.setState({nodes: data.nodes});
        });
    }

    onGetNode(node, onError) {
        this.emit('/node/get', {
            node,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onSetLoglevel(node, level, onError) {
        this.emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onSetZone(node, zone, onError) {
        this.emit('/node/zone', {
            node: node.node_id,
            zone,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onResetCounters(node, onError) {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.counters
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onShutdown(node, onError) {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onNewNode(config, onError) { // secret , ipAdress [, port]
        emit('/node/add', config).done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onPopNode(onError) {
        emit('/node/pop').done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onReplaceNode(config, onError) { // nodeId , secret [, port]
        emit('/node/replace', config).done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((_xhr, {error}) => onError(error));
    }









    
};

export {NodesActions, NodesStore};
