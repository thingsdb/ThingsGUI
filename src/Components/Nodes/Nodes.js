/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import ReplaceNode from './ReplaceNode';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import {TableWithRowExtend} from '../Util';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const Nodes = ({nodes}) => {

    const n = JSON.stringify(nodes);
    console.log(n);
    const getN = React.useCallback(
        () => {
            NodesActions.getNodes();
        },
        [n],
    );

    React.useEffect(() => {
        console.log("NODES");
        getN();
    }, [getN]);

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
    const rowExtend = (node) => <Node local={node} />;
    const handleButtons = (node) => <ReplaceNode node={node} />;
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} header={header} rows={rows} rowExtend={rowExtend} />
            <NodeButtons />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(Nodes);
