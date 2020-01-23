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
    const handleButtons = (node) => ([
        <Remove key={0} node={node} />,
    ]);
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} header={header} rows={rows} rowExtend={rowExtend} connectedNode={connectedNode} />
            <NodeButtons />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

// const areEqual = (prevProps, nextProps) => {
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };


// export default withStores(React.memo(Nodes, areEqual));

export default withStores(Nodes);
