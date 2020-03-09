/*eslint-disable no-unused-vars */

import deepEqual from 'deep-equal';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import moment from 'moment';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

const NodesActions = Vlow.createActions([
    'resetNodesStore',
    'getNodes',
    'getStreamInfo',
    'getNode',
    'getCounters',
    'setLoglevel',
    'resetCounters',
    'shutdown',
    'addNode',
    'delNode',
    'getBackups',
    'addBackup',
    'delBackup',
]);


class NodesStore extends BaseStore {

    static types = {
        counters: PropTypes.object,
        nodes: PropTypes.arrayOf(PropTypes.object),
        node: PropTypes.object,
        connectedNode: PropTypes.object,
        backups: PropTypes.arrayOf(PropTypes.object),
        streamInfo: PropTypes.object,
    }

    static defaults = {
        counters: {},
        nodes: [],
        node: {},
        connectedNode: {},
        backups: [],
        streamInfo: {},
    }

    constructor() {
        super(NodesActions);
        this.state = NodesStore.defaults;
    }


    onResetNodesStore() {
        this.setState({
            counters: {},
            nodes: [],
            node: {},
            connectedNode: {},
            backups: [],
            streamInfo: {},
        });
    }

    onGetNodes(){
        const {node, nodes} = this.state;
        const query = '{nodes: nodes_info(), connectedNode: node_info()};';
        this.emit('query', {
            scope: '@node',
            query
        }).done((data) => {
            data.connectedNode.uptime =  moment.duration(data.connectedNode.uptime , 'second').humanize();
            if (!deepEqual(data.nodes, nodes)|| data.connectedNode.node_id != node.node_id){
                this.setState({
                    nodes: data.nodes,
                    connectedNode: data.connectedNode
                });
            }
        }).fail((event, status, message) => {
            this.setState({
                counters: {},
                nodes: [],
                node: {},
            });
            ErrorActions.setToastError(message.Log);
        });
    }

    onGetStreamInfo(){
        const {nodes, streamInfo} = this.state;
        const query = 'nodes_info();';
        const obj = {};
        const length = nodes.length;
        nodes.slice(0, -1).map((n,i) => // need all nodes -1
            this.emit('query', {
                scope: `@node:${n.node_id}`,
                query
            }).done((data) => {
                data.slice(i).map(s=>{
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

    onGetNode(nodeId) {
        const {node} = this.state;
        const query = ' node_info();';
        this.emit('query', {
            scope: `@node:${nodeId}`,
            query
        }).done((data) => {
            data.uptime =  moment.duration(data.uptime , 'second').humanize();
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
            data.uptime =  moment.duration(data.uptime , 'second').humanize();
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

    onAddNode(config, tag, cb) { // secret , nodeName [, port]
        const query = config.port ? `new_node('${config.secret}', '${config.nodeName}', ${config.port});`: `new_node('${config.secret}', '${config.nodeName}');`;
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
