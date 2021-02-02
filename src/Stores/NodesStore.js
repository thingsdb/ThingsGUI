/*eslint-disable no-unused-vars */

import deepEqual from 'deep-equal';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

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
            node: {},
            nodes: [],
            streamInfo: {},
        });
    }

    onGetNodes(cb=()=>null){
        const {node, nodes} = this.state;
        const query = '{nodes: nodes_info(), connectedNode: node_info()};';
        this.emit('query', {
            scope: '@node',
            query
        }).done((data) => {
            if (!deepEqual(data.nodes, nodes)|| data.connectedNode.node_id != node.node_id){
                this.setState({
                    nodes: data.nodes,
                    connectedNode: data.connectedNode
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
        const query = 'node_info();';
        this.emit('query', {
            scope: '@node',
            query
        }).done((data) => {
            if (!deepEqual(data, connectedNode)){
                this.setState({
                    connectedNode: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetStreamInfo(){
        const {nodes, streamInfo} = this.state;
        const query = 'nodes_info();';
        const obj = {};
        const length = nodes.length;
        nodes.slice(0, -1).forEach((n,i) => // need all nodes -1
            this.emit('query', {
                scope: `@node:${n.node_id}`,
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
            }).fail((event, status, message) => {
                ErrorActions.setToastError(message.Log);
                if ((length-2)==i && !deepEqual(obj, streamInfo)){
                    this.setState({streamInfo: obj});
                }
            })
        );
    }

    onGetDashboardInfo(cb=()=>null){
        const {nodes, allNodeInfo} = this.state;
        const query = '{node_info: node_info(), counters: counters()};';
        const length = nodes.length;
        const arr = [];
        nodes.forEach((n,i) =>
            this.emit('query', {
                scope: `@node:${n.node_id}`,
                query
            }).done((data) => {
                arr.push(data);
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
        const query = ' node_info();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
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
        const query = ' counters();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
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
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRestore(fileName, takeAccess, tag, cb) {
        const query = `restore('${fileName}', ${takeAccess})`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((data) => {
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
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

    onAddNode(config, tag, cb) { // secret , nodename [, port]
        const query = config.port ? `new_node('${config.secret}', '${config.nName}', ${config.port});`: `new_node('${config.secret}', '${config.nName}');`;
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
        const {backups} = this.state;
        const query = 'backups_info();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
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
        const query = `new_backup('${config.file}'${config.time ? `, ${config.time}`:', now()'}${config.repeat ? `, ${config.repeat}${config.maxFiles?`, ${config.maxFiles}`:''}`:''})`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((_data) => {
            cb();
            this.onGetBackups(nodeId);
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onDelBackup(nodeId, backupId, cb, removeFile=false) {
        const query = `del_backup(${backupId}, ${removeFile});`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((_data) => {
            this.onGetBackups(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onGetModules(nodeId) {
        const {modules} = this.state;
        const query = 'modules_info();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
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
        const query = `module_info('${name}');`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            if (!deepEqual(data, _module)){
                this.setState({
                    _module: data,
                });
            }
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onAddModule(nodeId, config, tag, cb) {
        const query = `new_module('${config.name}', '${config.file}'${config.configuration ? `, ${config.configuration}` : ''})`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onDelModule(nodeId, name, cb) {
        const query = `del_module('${name}');`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRenameModule(nodeId, name, newName, tag, cb) {
        const query = `rename_module('${name}', '${newName}');`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            this.onGetModule(nodeId, newName);
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onRestartModule(nodeId, name, cb) {
        const query = `restart_module('${name}');`;
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((_data) => {
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onSetModuleConf(nodeId, name, configuration, tag, cb) {
        const query = `set_module_conf('${name}', ${configuration});`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            this.onGetModule(nodeId, name);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }

    onSetModuleScope(nodeId, name, scope, tag, cb) {
        const query = `set_module_scope('${name}', '${scope}');`;
        this.emit('query', {
            scope: '@thingsdb',
            query
        }).done((_data) => {
            this.onGetModule(nodeId, name);
            this.onGetModules(nodeId);
            cb();
        }).fail((event, status, message) => ErrorActions.setMsgError(tag, message.Log));
    }
}

export {NodesActions, NodesStore};
