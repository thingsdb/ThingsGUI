import React from 'react';
import {withVlow} from 'vlow';

import Node from './Node';
import Tabel from '../Util/Table2';
import {NodesStore} from '../../Stores/NodesStore';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const Nodes = ({nodes}) => {
    console.log(nodes);
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


    return (
        <React.Fragment>
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(Nodes);
