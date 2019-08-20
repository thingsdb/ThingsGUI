import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';

import Connect from './Connect';
import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Shutdown from './Shutdown';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import { StyledTabs, StyledTab } from '../Util';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['node', 'counters']
}]);

const useStyles = makeStyles(theme => ({
    info: {
        padding: theme.spacing(1),
    },
    counters: {
        padding: theme.spacing(1),
    },
}));

const Node = ({local, node, counters, onError}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        NodesActions.getNode(onError) // QUEST: en bij status update?
    }, [tabIndex]);

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue); 
    }

    return node && local.node_id === node.node_id ? (
        <React.Fragment>
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
                        <CountersReset node={node} onServerError={onError}/>
                    </Grid>
                </Grid>
            }
        </React.Fragment>
    ) : node ? (
        <Connect node={node} />
    ) : null;
};

Node.propTypes = {
    onError: PropTypes.func.isRequired,
    local: PropTypes.object.isRequired,

    /* nodes properties */
    node: NodesStore.types.node.isRequired,
    counters: NodesStore.types.counters.isRequired,

};

export default withStores(Node);