import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';

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
        this.emit('getNodes').done((data) => {
            this.setState({nodes: data.Nodes});
        }).fail((event, status, message) => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetNode() {
        this.emit('getNode').done((data) => {
            this.setState({
                node: data.Node,
                counters: data.Counters
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetLoglevel(node, level, tag, cb) {
        this.emit('setLoglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setState({
                node: data.Node
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }
    onResetCounters(node) {
        this.emit('resetCounters', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                counters: data.Counters
            });
        });//.fail((event, status, message) => ErrorActions.setMsgError(message.Log)); TODO create msg error!
    }

    onShutdown(node, tag, cb) {
        this.emit('shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                node: data.Node
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onAddNode(config, tag, cb) { // secret , address [, port]
        this.emit('newNode', config).done(() => {
            this.onGetNodes();
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onPopNode(tag, cb) {
        this.emit('popNode').done(() => {
            this.onGetNodes();
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onReplaceNode(config, tag, cb) { // nodeId , secret, address [, port]
        this.emit('replaceNode', config).done(() => {
            this.onGetNodes();
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

}

export {NodesActions, NodesStore};
