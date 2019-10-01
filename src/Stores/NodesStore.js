import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const scope='@node';

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
        const query = 'nodes_info();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({nodes: data});
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
        const query = '{counters: counters(), node: node_info()};';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetLoglevel(level, tag, cb) {
        const query = `set_log_level(${level}); node_info();`;
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                node: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);

        });
    }
    onResetCounters() {
        const query = 'reset_counters(); counters();';
        this.emit('query', {
            scope,
            query
        }).done((data) => {
            this.setState({
                counters: data
            });
        });//.fail((event, status, message) => ErrorActions.setMsgError(message.Log)); TODO create msg error!
    }

    onShutdown(tag, cb) {
        const query = 'shutdown(); node_info();';
        this.emit('query', {
            scope,
            query
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
        const query = config.port ? `new_node('${config.secret}', '${config.address}', ${config.port});`: `new_node('${config.secret}', '${config.address}');`;
        console.log(query);
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            cb();
            this.onGetNodes();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onPopNode(tag, cb) {
        const query = 'pop_node();';
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            cb();
            this.onGetNodes();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onReplaceNode(config, tag, cb) { // nodeId , secret, address [, port]
        const query = config.port ? `replace_node(${config.nodeId}, '${config.secret}', '${config.address}', ${config.port});`: `replace_node(${config.nodeId}, '${config.secret}', '${config.address}');`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            cb();
            this.onGetNodes();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

}

export {NodesActions, NodesStore};
