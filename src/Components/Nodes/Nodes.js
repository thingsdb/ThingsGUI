import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import Node from './Node';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import {TableWithRowExtend, ServerError} from '../Util';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const Nodes = ({nodes}) => {
    const [serverError, setServerError] = React.useState('')

    React.useEffect(() => {
        NodesActions.getNodes(handleServerError); // QUEST: en bij status update?
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
    const rowExtend = (node) => <Node local={node} />;

    const handleServerError = (err) => {
        setServerError(err.log);
    }

    const handleCloseError = () => {
        setServerError('');
    }
    const openError = Boolean(serverError); 

    return(
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <TableWithRowExtend header={header} rows={rows} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    nodes: PropTypes.array.isRequired,
};

export default withStores(Nodes);
