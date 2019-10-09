/* eslint-disable react/no-multi-comp */
import React from 'react';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import DelNode from './DelNode';
import TableWithRowExtend from './TableWithRowExtend';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes', 'connectedNode']
}]);

const Nodes = ({nodes, connectedNode}) => {

    console.log("NODES");
    React.useEffect(() => {
        NodesActions.getNodes();
        const setPoll = setInterval(
            () => {
                NodesActions.getNodes();
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);

    const rows = nodes;
    const header = [{
        ky: 'address',
        label: 'Address',
    }, {
        ky: 'port',
        label: 'Port',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const rowExtend = (node) => <Node selectedNode={node} />;
    const handleButtons = (node) => <DelNode node={node} />;
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} header={header} rows={rows} rowExtend={rowExtend} connectedNode={connectedNode}/>
            <NodeButtons />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

export default withStores(Nodes);
