import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid';
import React from 'react';

import { NodesActions, NodesStore } from '../../Stores';
import { Remove } from './Config';
import { Add, Restore } from './Config';
import Node from './Node';
import OpenNodeGraph from './SVGNodes/OpenNodeGraph';
import TableWithRowExtend from './TableWithRowExtend';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes', 'connectedNode']
}]);


const Nodes = ({nodes, connectedNode}) => {

    const handleRefresh = React.useCallback(() => {
        NodesActions.getNodes();
    }, []);

    React.useEffect(() => {
        handleRefresh();
    }, [handleRefresh]);

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
        <Grid container spacing={1}>
            <Grid size={12}>
                <TableWithRowExtend buttons={handleButtons} canExtend={handleCanExtend} header={header} rows={rows} rowExtend={rowExtend} connectedNode={connectedNode} onRefresh={handleRefresh} />
            </Grid>
            <Grid size={12}>
                <Grid container spacing={1} sx={{marginLeft: '8px'}}>
                    <Grid>
                        <Add />
                    </Grid>
                    <Grid>
                        <OpenNodeGraph nodes={nodes} />
                    </Grid>
                    <Grid>
                        <Restore nodes={nodes} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

export default withStores(Nodes);
