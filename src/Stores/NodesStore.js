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
        this.emit('/node/getnodes').done((data) => {
            this.setState({nodes: data.nodes});
        });
    }

    onGetNode(onError) {
        this.emit('/node/get').done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message));
    }

    onSetLoglevel(node, level, onError) {
        this.emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message));
    }

    onSetZone(node, zone, onError) {
        this.emit('/node/zone', {
            node: node.node_id,
            zone,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message));
    }

    onResetCounters(node, onError) {
        this.emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.counters
            });
        }).fail((event, status, message) => onError(message));
    }

    onShutdown(node, onError) {
        this.emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message));
    }

    onAddNode(config, onError) { // secret , ipAdress [, port]
        this.emit('/node/add', config).done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((event, status, message) => onError(message));
    }

    onPopNode(onError) {
        this.emit('/node/pop').done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((event, status, message) => onError(message));
    }

    onReplaceNode(config, onError) { // nodeId , secret [, port]
        this.emit('/node/replace', config).done((data) => {
            this.setState({
                nodes: data.nodes
            });
        }).fail((event, status, message) => onError(message));
    }
    
};

export {NodesActions, NodesStore};
