/* eslint-disable react/no-multi-comp */
// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Node from './Node';
import Tabel from '../Util/Table2';
import {useStore} from '../../Stores/NodesStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const Nodes = () => {
    const [store] = useStore();
    const {nodes} = store;
    
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
    const rowExtend = (node) => <Node node={node} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    // classes: PropTypes.object.isRequired,
    // nodes: ApplicationStore.types.nodes.isRequired
};

export default withStyles(styles)(Nodes);