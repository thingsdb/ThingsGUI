import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';

import {Add, Backup} from './Backup';
import {Counters, CountersReset} from './Counters';
import {Loglevel, NodeInfo, Shutdown} from './Config';
import {NodesActions, NodesStore} from '../../Stores';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['node', 'counters', 'backups']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        maxHeight: '400px',
    },
}));

const Node = ({selectedNode, node, counters, backups}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        const setPoll = setInterval(
            () => {
                NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
                NodesActions.getBackups(selectedNode.node_id);
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);

    React.useEffect(() => {
        NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
        NodesActions.getBackups(selectedNode.node_id);
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
                <Tab label="Backup" />
            </Tabs>
            {tabIndex === 0 &&
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} className={classes.overflow}>
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
                    container
                    spacing={3}
                >
                    <Grid item xs={12} className={classes.overflow}>
                        <Counters counters={counters} />
                    </Grid>
                    {offline ? null : (
                        <Grid item xs={12}>
                            <CountersReset node={node} />
                        </Grid>
                    )}
                </Grid>
            }
            {tabIndex === 2 &&
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} className={classes.overflow}>
                        <Backup nodeId={selectedNode.node_id} backups={backups} />
                    </Grid>
                    {offline ? null : (
                        <Grid item xs={12}>
                            <Add node={node} />
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
    backups: NodesStore.types.backups.isRequired,

};

// const areEqual = (prevProps, nextProps) => {
//     console.log(prevProps, nextProps);
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };


// export default withStores(React.memo(Node, areEqual));

export default withStores(Node);