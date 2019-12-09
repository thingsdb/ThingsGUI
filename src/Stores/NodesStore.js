import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const NodesActions = Vlow.createActions([
    'resetNodesStore',
    'getNodes',
    'getNode',
    'setLoglevel',
    'resetCounters',
    'shutdown',
    'addNode',
    'delNode',
    'getBackups',
    'addBackup',
    'delBackup',
]);

// TODO: CALLBACKS
class NodesStore extends BaseStore {

    static types = {
        counters: PropTypes.object,
        nodes: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
        connectedNode: PropTypes.object,
        backups: PropTypes.arrayOf(PropTypes.object),
    }

    static defaults = {
        counters: {},
        nodes: [],
        node: {},
        connectedNode: {},
        backups: [],
    }

    constructor() {
        super(NodesActions);
        this.state = NodesStore.defaults;
        this.onGetNodes();
    }


    onResetNodesStore() {
        this.setState({
            counters: {},
            nodes: [],
            node: {},
            connectedNode: {},
            backups: [],
        });
    }

    onGetNodes(){
        const query = '{nodes: nodes_info(), connectedNode: node_info()};';
        this.emit('query', {
            scope: '@node',
            query
        }).done((data) => {
            this.setState({
                nodes: data.nodes,
                connectedNode: data.connectedNode
            });
        }).fail((event, status, message) => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetNode(nodeId) {
        const query = '{counters: counters(), node: node_info()};';
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetLoglevel(nodeId, level, tag, cb) {
        const query = `set_log_level(${level}); node_info();`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
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
    onResetCounters(nodeId) {
        const query = 'reset_counters(); counters();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                counters: data
            });
        });//.fail((event, status, message) => ErrorActions.setMsgError(message.Log)); TODO create msg error!
    }

    onShutdown(nodeId, tag, cb) {
        const query = 'shutdown(); {nodes: nodes_info()};';
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                nodes: data.nodes
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onAddNode(config, tag, cb) { // secret , address [, port]
        const query = config.port ? `new_node('${config.secret}', '${config.address}', ${config.port});`: `new_node('${config.secret}', '${config.address}');`;
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

    onDelNode(nodeId, tag, cb) {
        const query = `del_node(${nodeId});`;
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

    onGetBackups(nodeId) {
        const query = 'backups_info();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                backups: data,
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onAddBackup(nodeId, config, tag, cb) {
        const query = `new_backup('${config.file}'${config.time ? `, '${config.time}'${config.repeat ? `, ${config.repeat}`:''}`:''});`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((_data) => {
            cb();
            this.onGetBackups(nodeId);
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onDelBackup(nodeId, backupId) {
        const query = `del_backup(${backupId});`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((_data) => {
            this.onGetBackups(nodeId);
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }


}

export {NodesActions, NodesStore};
