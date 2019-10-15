import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';

import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import NodeInfo from './NodeInfo';
import Shutdown from './Shutdown';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['node', 'counters']
}]);

const useStyles = makeStyles(theme => ({
    info: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        height: '600px',
    },
    counters: {
        padding: theme.spacing(1),
    },
}));

const Node = ({selectedNode, node, counters}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    console.log(counters, node);

    React.useEffect(() => {
        NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
    }, [tabIndex]);

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    const offline = selectedNode.status == 'OFFLINE';

    return node ? (
        <React.Fragment>
            <Tabs value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                <Tab label="Node Info" />
                <Tab label="Counters" />
            </Tabs>
            {tabIndex === 0 &&
                <Grid
                    className={classes.info}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <NodeInfo node={node} />
                    </Grid>
                    {offline ? null : (
                        <Grid item container xs={12} spacing={1} >
                            <Grid item>
                                <Loglevel node={node} />
                            </Grid>
                            <Grid item>
                                <Shutdown node={node} />
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            }
            {tabIndex === 1 &&
                <Grid
                    className={classes.counters}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Counters counters={counters} />
                    </Grid>
                    {offline ? null : (
                        <Grid item xs={12}>
                            <CountersReset node={node} />
                        </Grid>
                    )}
                </Grid>
            }
        </React.Fragment>
    ) : null;
};

Node.propTypes = {
    selectedNode: PropTypes.object.isRequired,

    /* nodes properties */
    node: NodesStore.types.node.isRequired,
    counters: NodesStore.types.counters.isRequired,

};

export default withStores(Node);