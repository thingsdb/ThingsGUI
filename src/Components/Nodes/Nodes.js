import React from 'react';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import {Remove} from './Config';
import TableWithRowExtend from './TableWithRowExtend';
import {NodesActions, NodesStore} from '../../Stores';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes', 'connectedNode']
}]);


const Nodes = ({nodes, connectedNode}) => {

    const handleRefresh = () => {
        NodesActions.getNodes();
    };


    const rows = nodes;
    const header = [{
        ky: 'node_name',
        label: 'Node name',
        color: () => 'inherit'
    }, {
        ky: 'port',
        label: 'Port',
        color: () => 'inherit'
    }, {
        ky: 'status',
        label: 'Status',
        color: (s) => s === 'OFFLINE' ? 'error' : 'inherit'
    }];
    const rowExtend = (node) => <Node selectedNode={node} />;
    const handleButtons = (node) => ([
        <Remove key={0} node={node} />,
    ]);
    const handleCanExtend = (node) => node.status !== 'OFFLINE';
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} canExtend={handleCanExtend} header={header} rows={rows} rowExtend={rowExtend} connectedNode={connectedNode} onRefresh={handleRefresh} />
            <NodeButtons nodes={nodes} />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

export default withStores(Nodes);
