import BaseActions from './BaseActions';

export default class NodesActions extends BaseActions {

    getNodes(){
        this.emit('/node/getnodes').done((data) => {
            this.setGlobal({nodes: data.nodes});
        }).fail((event, status, message) => this.setGlobal({
            error: message,
            counters: {},
            nodes: [],
            node: {},
        }));
    }

    getNode() {
        this.emit('/node/get').done((data) => {
            this.setGlobal({
                node: data.node,
                counters: data.counters
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    setLoglevel(node, level) {
        this.emit('/node/loglevel', {
            node: node.node_id,
            level,
        }).done((data) => {
            this.setGlobal({
                node: data.node
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    resetCounters(node) {
        this.emit('/node/counters/reset', {
            node: node.node_id,
        }).done((data) => {
            this.setGlobal({
                counters: data.counters
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    shutdown(node) {
        this.emit('/node/shutdown', {
            node: node.node_id,
        }).done((data) => {
            this.setGlobal({
                node: data.node
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    addNode(config) { // secret , ipAddress [, port]
        this.emit('/node/add', config).done(() => {
            this.onGetNodes();
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    popNode() {
        this.emit('/node/pop').done(() => {
            this.onGetNodes();
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    replaceNode(config) { // nodeId , secret [, port]
        this.emit('/node/replace', config).done(() => {
            this.onGetNodes();
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

}
