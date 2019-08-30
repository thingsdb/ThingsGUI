import PropTypes from 'prop-types';
import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core';

import Connect from './Connect';
import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import NodeInfo from './NodeInfo';
import Shutdown from './Shutdown';
import NodesActions from '../../Actions/NodesActions';
import { StyledTabs, StyledTab } from '../Util';




const useStyles = makeStyles(theme => ({
    info: {
        padding: theme.spacing(1),
    },
    counters: {
        padding: theme.spacing(1),
    },
}));

const Node = ({local}) => {
    const node = useGlobal('node')[0];
    const counters = useGlobal('counters')[0];
    console.log('node');
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        NodesActions.getNode(); // QUEST: en bij status update?
    }, [tabIndex]);

    const onConnected = () => {
        NodesActions.getNode();
    };

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

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
                        <NodeInfo node={node} />
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
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <Counters counters={counters} />
                    </Grid>
                    <Grid item xs={12}>
                        <CountersReset node={node} />
                    </Grid>
                </Grid>
            }
        </React.Fragment>
    ) : node ? (
        <Connect node={node} onConnected={onConnected} />
    ) : null;
};

Node.propTypes = {
    local: PropTypes.object.isRequired,
};

export default Node;