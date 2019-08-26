import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const NodesActions = Vlow.createActions([
    'getNodes',
    'getNode',
    'setLoglevel',
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
    }

    onGetNodes(){
        this.emit('/node/getnodes').done((data) => {
            this.setState({nodes: data.nodes});
        }).fail(() => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
        });
    }

    onGetNode() {
        this.emit('/node/get').done((data) => {
            this.setState({
                node: data.node,
                counters: data.counters
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

    onResetCounters(node) {
        this.emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                counters: data.counters
            });
        });
    }

    onShutdown(node) {
        this.emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.node
            });
        });
    }

    onAddNode(config) { // secret , ipAddress [, port]
        this.emit('/node/add', config).done(() => {
            this.onGetNodes();
        });
    }

    onPopNode() {
        this.emit('/node/pop').done(() => {
            this.onGetNodes();
        });
    }

    onReplaceNode(config) { // nodeId , secret [, port]
        this.emit('/node/replace', config).done(() => {
            this.onGetNodes();
        });
    }

}

export {NodesActions, NodesStore};
