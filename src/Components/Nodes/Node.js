import PropTypes from 'prop-types';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
import {withVlow} from 'vlow';

import Connect from './Connect';
import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Zone from './Zone';
import Shutdown from './Shutdown';
import {StyledTabs, StyledTab} from '../Util/Tabs';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['node', 'counters']
}]);

const styles = theme => ({
    info: {
        padding: theme.spacing(1),
    },
    counters: {
        padding: theme.spacing(1),
    },
});

const initialState = {
    tabIndex: 0, 
    serverError: "",
};

const Node = ({classes, local, node, counters}) => {
    const [state, setState] = React.useState(initialState);
    const {tabIndex, serverError} = state; 

    React.useEffect(() => {
        NodesActions.getNode((err) => setState({...state, serverError: err})) // QUEST: en bij status update?
    }, [local.node_id]);

    const handleChangeTab = (_event, newValue) => setState({...state, tabIndex: newValue}); 
    console.log(node);
    return node && local.node_id === node.node_id ? (
        <React.Fragment>
            <StyledTabs value={tabIndex} onChange={handleChangeTab} aria-label="styled tabs example">
                <StyledTab label="Node Info" />
                <StyledTab label="Counters" />
            </StyledTabs>
            {tabIndex === 0 && 
                <Grid
                    alignItems="stretch"
                    className={classes.info}
                    container
                    direction="column"
                    justify="center"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Info node={node} />
                    </Grid>
                    <Grid item container xs={12} spacing={1} >
                        <Grid item>
                            <Loglevel node={node} />
                        </Grid>
                        <Grid item>
                            <Zone node={node} />
                        </Grid>
                        <Grid item>
                            <Shutdown node={node} />
                        </Grid>
                    </Grid>
                </Grid>
            }
            {tabIndex === 1 && 
                <Grid
                    alignItems="stretch"
                    className={classes.counters}
                    container
                    direction="column"
                    justify="center"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Counters counters={counters} />
                    </Grid>
                    <Grid item container xs={12} spacing={1} >
                        <Grid item>
                            <CountersReset node={node} />
                        </Grid>
                    </Grid>
                </Grid>
            }
        </React.Fragment>
    ) : node ? (
        <Connect node={node} />
    ) : null;
};

Node.propTypes = {
    local: PropTypes.object.isRequired,

    /* nodes properties */
    node: NodesStore.types.node.isRequired,
    counters: NodesStore.types.counters.isRequired,

};

export default withStyles(styles)(withStores(Node));