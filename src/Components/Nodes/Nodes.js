import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import Node from './Node';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import {TableWithRowExtend} from '../Util';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const Nodes = ({onError, nodes}) => {

    React.useEffect(() => {
        NodesActions.getNodes(onError); // QUEST: en bij status update?
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
    const rowExtend = (node) => <Node local={node} onError={onError} />;

    return(
        <React.Fragment>
            <TableWithRowExtend header={header} rows={rows} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    onError: PropTypes.func.isRequired,
    nodes: PropTypes.array.isRequired,
};

export default withStores(Nodes);
