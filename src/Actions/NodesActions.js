import {emit, useStore} from './BaseActions';

const NodesActions = {

    getNodes: (dispatch) => {
        emit('/node/getnodes').done((data) => {
            dispatch(() => {
                return {
                    nodes: data.nodes
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    getNode: (dispatch) => {
        emit('/node/get').done((data) => {
            dispatch(() => {
                return {
                    node: data.node,
                    counters: data.counters
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    setLoglevel: (dispatch, node, level) => {
        emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            dispatch(() => {
                return {
                    node: data.node,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    resetCounters: (dispatch, node) => {
        emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            dispatch(() => {
                return {
                    counters: data.counters
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    shutdown: (dispatch, node) => {
        emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            dispatch(() => {
                return {
                    node: data.node,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    addNode: (dispatch, config) => { // secret , ipAddress [, port]
        emit('/node/add', config).done(() => {
            NodesActions.onGetNodes(dispatch);
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    popNode: (dispatch) => {
        emit('/node/pop').done(() => {
            NodesActions.onGetNodes(dispatch);
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    replaceNode: (dispatch, config) => { // nodeId , secret [, port]
        emit('/node/replace', config).done(() => {
            NodesActions.onGetNodes(dispatch);
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

};

export {NodesActions, useStore};
