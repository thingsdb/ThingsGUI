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
        this.emit('/node/getnodes').done((data) => {
            this.setState({nodes: data.nodes});
        }).fail((event, status, message) => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
            ErrorActions.setToastError(message.log);
        });
    }

    onGetNode() {
        this.emit('/node/get').done((data) => {
            this.setState({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.log));
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

    onResetCounters(node) {
        this.emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setState({
                counters: data.counters
            });
        });//.fail((event, status, message) => onError(message)); TODO create msg error!
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

    onAddNode(config, onError) { // secret , ipAddress [, port]
        this.emit('/node/add', config).done(() => {
            this.onGetNodes(onError);
        }).fail((event, status, message) => onError(message));
    }

    onPopNode(onError) {
        this.emit('/node/pop').done(() => {
            this.onGetNodes(onError);
        }).fail((event, status, message) => onError(message));
    }

    onReplaceNode(config, onError) { // nodeId , secret [, port]
        this.emit('/node/replace', config).done(() => {
            this.onGetNodes(onError);
        }).fail((event, status, message) => onError(message));
    }

}

export {NodesActions, NodesStore};
