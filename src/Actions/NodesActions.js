import { emit } from './BaseActions';
import { setGlobal } from 'reactn';

const NodesActions = {

    getNodes: () => {
        emit('/node/getnodes').done((data) => {
            setGlobal({nodes: data.nodes});
        }).fail((event, status, message) => setGlobal({
            error: message,
            counters: {},
            nodes: [],
            node: {},
        }));
    },

    getNode: () => {
        emit('/node/get').done((data) => {
            setGlobal({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    setLoglevel: (node, level) => {
        emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            setGlobal({
                node: data.node
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    resetCounters: (node) => {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            setGlobal({
                counters: data.counters
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    shutdown: (node) => {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            setGlobal({
                node: data.node
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    addNode: (config) => { // secret , ipAddress [, port]
        emit('/node/add', config).done(() => {
            NodesActions.onGetNodes();
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    popNode: () => {
        emit('/node/pop').done(() => {
            NodesActions.onGetNodes();
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    replaceNode: (config) => { // nodeId , secret [, port]
        emit('/node/replace', config).done(() => {
            NodesActions.onGetNodes();
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

};

export default NodesActions;
