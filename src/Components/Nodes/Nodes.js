import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import {TableWithRowExtend} from '../Util';
import {NodesStore} from '../../Stores/NodesStore';



const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const useStyles = makeStyles(theme => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));

const Nodes = ({open, onClose, nodes}) => {
    const classes = useStyles();


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
    const rowExtend = (node) => <Node local={node} />; // eslint-disable-line react/no-multi-comp

    return(
        <div>
            <div className={classes.drawerHeader}>
                <IconButton onClick={onClose}>
                    {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                </IconButton>
                <Typography variant="h6">
                    {'NODES'}
                </Typography>
            </div>
            <Divider />
            <TableWithRowExtend header={header} rows={rows} rowExtend={rowExtend} />
            <NodeButtons />
        </div>
    );
};

Nodes.propTypes = {
    nodes: NodesStore.types.nodes.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStores(Nodes);
