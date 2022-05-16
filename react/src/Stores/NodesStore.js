/*eslint-disable no-unused-vars */

import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import {
    DEL_BACKUP_ARGS,
    ID_ARGS,
    NAME_ARGS,
    NEW_BACKUP_ARGS,
    NEW_MODULE_ARGS,
    NEW_NODE_ARGS,
    RENAME_ARGS,
    RESTORE_ARGS,
    SET_LOG_LEVEL_ARGS,
    SET_MODULE_CONF_ARGS,
    SET_MODULE_SCOPE_ARGS,
} from '../TiQueries/Arguments';
import {
    BACKUPS_INFO_QUERY,
    COUNTERS_QUERY,
    DEL_BACKUP_QUERY,
    DEL_MODULE_QUERY,
    DEL_NODE_QUERY,
    MODULE_INFO_QUERY,
    MODULES_INFO_QUERY,
    NEW_BACKUP_QUERY,
    NEW_MODULE_QUERY,
    NEW_NODE_QUERY,
    NODE_COUNTERS_INFO_QUERY,
    NODE_INFO_QUERY,
    NODES_INFO_QUERY,
    NODES_NODE_INFO_QUERY,
    RENAME_MODULE_QUERY,
    RESET_COUNTERS_QUERY,
    RESTART_MODULE_QUERY,
    RESTORE_QUERY,
    SET_LOG_LEVEL_QUERY,
    SET_MODULE_CONF_QUERY,
    SET_MODULE_SCOPE_QUERY,
    SHUTDOWN_QUERY,
} from '../TiQueries/Queries';
import { THINGSDB_SCOPE, NODE_SCOPE } from '../Constants/Scopes';

const NodesActions = Vlow.createActions([
    'addBackup',
    'addModule',
    'addNode',
    'delBackup',
    'delModule',
    'delNode',
    'getBackups',
    'getConnectedNode',
    'getCounters',
    'getDashboardInfo',
    'getModule',
    'getModules',
    'getNode',
    'getNodes',
    'getStreamInfo',
    'renameModule',
    'restartModule',
    'resetCounters',
    'resetNodesStore',
    'restore',
    'setLoglevel',
    'setModuleConf',
    'setModuleScope',
    'shutdown',
]);


class NodesStore extends BaseStore {

    static types = {
        allNodeInfo: PropTypes.arrayOf(PropTypes.object),
        backups: PropTypes.arrayOf(PropTypes.object),
        connectedNode: PropTypes.object,
        counters: PropTypes.object,
        _module: PropTypes.object,
        modules: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
        nodes: PropTypes.arrayOf(PropTypes.object),
        streamInfo: PropTypes.object,
    }

    static defaults = {
        allNodeInfo: [],
        backups: [],
        connectedNode: {},
        counters: {},
        _module: {},
        modules: [],
        node: {},
        nodes: [],
        streamInfo: {},
    }

    constructor() {
        super(NodesActions);
        this.state = NodesStore.defaults;
    }


    onResetNodesStore() {
        this.setState({
            allNodeInfo: [],
            backups: [],
            connectedNode: {},
            counters: {},
            _module: {},
            modules: [],
            node: {},
            nodes: [],
            streamInfo: {},
        });
    }

    onGetNodes(cb=()=>null){
        const {node, nodes} = this.state;
        const query = NODES_NODE_INFO_QUERY;
        this.emit('query', {
            scope: NODE_SCOPE,
            query
        }).done((data) => {
            const [freshNodes, connectedNode] = data;
            if (!deepEqual(freshNodes, nodes)|| connectedNode.node_id != node.node_id){
                this.setState({
                    nodes: freshNodes,
                    connectedNode: connectedNode
                });
            }
            cb();
        }).fail((event, status, message) => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetConnectedNode() {
        const {connectedNode} = this.state;
        const query = NODE_INFO_QUERY;
        this.emit('query', {
            scope: NODE_SCOPE,
            query
        }).done((data) => {
            if (!deepEqual(data, connectedNode)){
                this.setState({
                    connectedNode: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetStreamInfo(callback=()=>null){
        const {nodes, streamInfo} = this.state;
        const query = NODES_INFO_QUERY;
        const obj = {};
        const length = nodes.length;
        nodes.slice(0, -1).forEach((n,i) => // need all nodes -1
            this.emit('query', {
                scope: `${NODE_SCOPE}:${n.node_id}`,
                query
            }).done((data) => {
                data.slice(i).forEach(s=>{
                    if(s.stream&&s.stream.includes('node-out')){
                        obj[s.node_id] = obj[s.node_id]?[...obj[s.node_id], n.node_id]:[n.node_id];
                    } else if(s.stream&&s.stream.includes('node-in')) {
                        obj[n.node_id] = obj[n.node_id]?[...obj[n.node_id], s.node_id]:[s.node_id];
                    }
                });

                if ((length-2)==i && !deepEqual(obj, streamInfo)){
                    this.setState({streamInfo: obj});
                }
                callback();
            }).fail((event, status, message) => {
                ErrorActions.setToastError(message.Log);
                if ((length-2)==i && !deepEqual(obj, streamInfo)){
                    this.setState({streamInfo: obj});
                }
                callback();
            })
        );
    }

    onGetDashboardInfo(cb=()=>null){
        const {nodes, allNodeInfo} = this.state;
        const query = NODE_COUNTERS_INFO_QUERY;
        const length = nodes.length;
        const arr = [];
        nodes.forEach((n,i) =>
            this.emit('query', {
                scope: `${NODE_SCOPE}:${n.node_id}`,
                query
            }).done((data) => {
                const [node, counters] = data;
                arr.push({
                    node_info: node,
                    counters: counters
                });
                if ((length-1)==i && !deepEqual(arr, allNodeInfo)){
                    this.setState({allNodeInfo: arr});
                    cb(arr);
                }
            }).fail((event, status, message) => {
                ErrorActions.setToastError(message.Log);
                if ((length-1)==i && !deepEqual(arr, allNodeInfo)){
                    this.setState({allNodeInfo: arr});
                    cb(arr);
                }
            })
        );
    }

    onGetNode(nodeId) {
        const {node} = this.state;
        const query = NODE_INFO_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            if (!deepEqual(data, node)){
                this.setState({
                    node: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetCounters(nodeId) {
        const {counters} = this.state;
        const query = COUNTERS_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            if (!deepEqual(data, counters)){
                this.setState({
                    counters: data
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetLoglevel(nodeId, level, tag, cb) {
        const query = SET_LOG_LEVEL_QUERY + ' ' + NODE_INFO_QUERY ;
        const jsonArgs = SET_LOG_LEVEL_ARGS(level);
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query,
            arguments: jsonArgs
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
        const query = RESET_COUNTERS_QUERY + ' ' + COUNTERS_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                counters: data
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRestore(fileName, takeAccess, restoreTasks, tag, cb) {
        const query = RESTORE_QUERY(takeAccess, restoreTasks);
        const jsonArgs = RESTORE_ARGS(fileName, takeAccess, restoreTasks);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((data) => {
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onShutdown(nodeId, tag, cb) {
        const query = SHUTDOWN_QUERY + ' ' + NODES_INFO_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            this.setState({
                nodes: data
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onAddNode(config, tag, cb) { // secret , nodename [, port]
        const query = NEW_NODE_QUERY(config.port);
        const jsonArgs = NEW_NODE_ARGS(config.secret, config.nName, Number(config.port));
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            cb();
            this.onGetNodes();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onDelNode(nodeId, tag, cb) {
        const query = DEL_NODE_QUERY;
        const jsonArgs = ID_ARGS(nodeId);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            cb();
            this.onGetNodes();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetBackups(nodeId) {
        const {backups} = this.state;
        const query = BACKUPS_INFO_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            if (!deepEqual(data, backups)){
                this.setState({
                    backups: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onAddBackup(nodeId, config, tag, cb) {
        const query = NEW_BACKUP_QUERY(config.time, config.repeat, config.maxFiles);
        const jsonArgs = NEW_BACKUP_ARGS(config.file, config.time, config.repeat, config.maxFiles);
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            cb();
            this.onGetBackups(nodeId);
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onDelBackup(nodeId, backupId, cb, deleteFiles=false) {
        const query = DEL_BACKUP_QUERY;
        const jsonArgs = DEL_BACKUP_ARGS(backupId, deleteFiles);
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetBackups(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetModules(nodeId) {
        const {modules} = this.state;
        const query = MODULES_INFO_QUERY;
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query
        }).done((data) => {
            if (!deepEqual(data, modules)){
                this.setState({
                    modules: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetModule(nodeId, name) {
        const {_module} = this.state;
        const query = MODULE_INFO_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query,
            arguments: jsonArgs
        }).done((data) => {
            if (!deepEqual(data, _module)){
                this.setState({
                    _module: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onAddModule(nodeId, config, tag, cb) {
        const query = NEW_MODULE_QUERY(config.configuration);
        const jsonArgs = NEW_MODULE_ARGS(config.name, config.source, config.configuration);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onDelModule(nodeId, name, cb) {
        const query = DEL_MODULE_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRenameModule(nodeId, current, newName, tag, cb) {
        const query = RENAME_MODULE_QUERY;
        const jsonArgs = RENAME_ARGS(current, newName);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModule(nodeId, newName);
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onRestartModule(nodeId, name, cb) {
        const query = RESTART_MODULE_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            scope: `${NODE_SCOPE}:${nodeId}`,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetModuleConf(nodeId, name, configuration, tag, cb) {
        const query = SET_MODULE_CONF_QUERY;
        const jsonArgs = SET_MODULE_CONF_ARGS(name, configuration);

        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModule(nodeId, name);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onSetModuleScope(nodeId, name, scope, tag, cb) {
        const query = SET_MODULE_SCOPE_QUERY;
        const jsonArgs = SET_MODULE_SCOPE_ARGS(name, scope);
        this.emit('query', {
            scope: THINGSDB_SCOPE,
            query,
            arguments: jsonArgs
        }).done((_data) => {
            this.onGetModule(nodeId, name);
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }
}

export {NodesActions, NodesStore};
