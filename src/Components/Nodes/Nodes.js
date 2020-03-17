/* eslint-disable react/no-multi-comp */
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
    const {intervalId, setIntervalId} = React.useState(null);
    React.useEffect(() => {
        NodesActions.getNodes(NodesActions.getStreamInfo);
        return () => {
            stopPoll();
        };
    }, []);
    const handleRefresh = () => {
        NodesActions.getNodes();
    };

    const startPoll = () => {
        const setPoll = setInterval(
            () => {
                NodesActions.getNodes();
            }, 1000);
        setIntervalId(setPoll);
    };

    const stopPoll = () => {
        clearInterval(intervalId);
    };


    const rows = nodes;
    const header = [{
        ky: 'node_name',
        label: 'Node name',
    }, {
        ky: 'port',
        label: 'Port',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const rowExtend = (node) => <Node selectedNode={node} />;
    const handleButtons = (node) => ([
        <Remove key={0} node={node} />,
    ]);
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} header={header} rows={rows} rowExtend={rowExtend} connectedNode={connectedNode} onRefresh={handleRefresh} />
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
