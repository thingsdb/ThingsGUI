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
        NodesActions.getNode((err) => setState({...state, serverError: err.log})) // QUEST: en bij status update?
    }, [tabIndex]);

    const handleChangeTab = (_event, newValue) => {
        setState({...state, tabIndex: newValue}); 
    }

    const handleServerError = (err) => {
        setState({...state, serverError: err.log});
    }

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }
    const openError = Boolean(serverError); 

    return node && local.node_id === node.node_id ? (
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <StyledTabs value={tabIndex} onChange={handleChangeTab} aria-label="styled tabs example">
                <StyledTab label="Node Info" />
                <StyledTab label="Counters" />
            </StyledTabs>
            {tabIndex === 0 && 
                <Grid
                    className={classes.info}
                    container
                    direction="column"
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
                            <Shutdown node={node} />
                        </Grid>
                    </Grid>
                </Grid>
            }
            {tabIndex === 1 && 
                <Grid
                    className={classes.counters}
                    container
                    direction="column"
                    spacing={0}
                >
                    <Grid item xs={12}>
                        <Counters counters={counters} />
                    </Grid>
                    <Grid item xs={12}>
                        <CountersReset node={node} onServerError={handleServerError}/>
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