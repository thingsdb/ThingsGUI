import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import Node from './Node';
import Tabel from '../Util/Table2';
import {NodesStore} from '../../Stores/NodesStore';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const Nodes = ({nodes}) => {
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
    nodes: PropTypes.array.isRequired,
};

export default withStores(Nodes);
