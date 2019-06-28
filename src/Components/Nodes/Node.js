import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Zone from './Zone';
import Shutdown from './Shutdown';
import {NodesActions, useStore} from '../../Stores/NodesStore';

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

const Node = ({node}) => {
    const [store, dispatch] = useStore();
    // const {nodesLookup} = store;
    // const fetch = React.useCallback(NodeActions.node(dispatch, node.node_id), [dispatch]);

    // React.useEffect(() => {
    //     fetch();
    // }, [node]);

    const nodeInfo = store; // TODOK nodesLookup[node.node_id];
    
    return nodeInfo ? (
        <React.Fragment>
            {/* <Typography>
                {node.name}
            </Typography> */}

            
            {<Info node={nodeInfo.node} />}
            <Typography variant="h6" >
                {'Counters'}
            </Typography>
            {<Counters counters={nodeInfo.counters} />}
            
            <CountersReset node={nodeInfo.node} />
            <Loglevel node={nodeInfo.node} />
            <Zone node={nodeInfo.node} />
            <Shutdown node={nodeInfo.node} />
            
        </React.Fragment>
    ) : null;
};

Node.propTypes = {
    node: PropTypes.object.isRequired,
};

export default withStyles(styles)(Node);