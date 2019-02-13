import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Zone from './Zone';
import Shutdown from './Shutdown';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match', 'nodesLookup'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Node extends React.Component {

    constructor(props) {
        super(props);
        ApplicationActions.node(props.node);
    }
    
    render() {
        const {node, nodesLookup} = this.props;
        const nodeInfo = nodesLookup[node.node_id];
        
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
    }
}

Node.propTypes = {
    // classes: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    nodesLookup: ApplicationStore.types.nodesLookup.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(Node));