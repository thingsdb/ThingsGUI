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

    onGetNodes(cb=() => null){
        this.emit('/node/getnodes').done((data) => {
            this.setState({nodes: data.nodes});
        }).always(cb);
    }

    onGetNode(onError) {
        this.emit('/node/get').done((data) => {
            this.setState({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => onError(message.log));
    }

    onSetLoglevel(node, level, onError) {
        this.emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message.log));
    }

    onSetZone(node, zone, onError) {
        this.emit('/node/zone', {
            node: node.node_id,
            zone,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message.log));
    }

    onResetCounters(node, onError) {
        this.emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                counters: data.counters
            });
        }).fail((event, status, message) => onError(message.log));
    }

    onShutdown(node, onError) {
        this.emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        }).fail((event, status, message) => onError(message.log));
    }

    onAddNode(config, onError) { // secret , ipAddress [, port]
        this.emit('/node/add', config).done(() => {
            this.onGetNodes(); 
        }).fail((event, status, message) => this.onGetNodes(() => onError(message.log)));
    }

    onPopNode(onError) {
        this.emit('/node/pop').done(() => {
            this.onGetNodes(); 
        }).fail((event, status, message) => this.onGetNodes(() => onError(message.log)));
    }

    onReplaceNode(config, onError) { // nodeId , secret [, port]
        this.emit('/node/replace', config).done(() => {
            this.onGetNodes(); 
        }).fail((event, status, message) => this.onGetNodes(() => onError(message.log)));
    }
    
};

export {NodesActions, NodesStore};
