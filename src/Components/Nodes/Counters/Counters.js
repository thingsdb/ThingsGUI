/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

import { Info } from '../../Util';
import CountersReset from './CountersReset';
import {NodesActions, NodesStore} from '../../../Stores';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['counters']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        maxHeight: '400px',
    },
}));

const header = [
    {ky: 'title1', title: 'QUERIES', labels: [
        {ky: 'queries_success', label: 'Successful queries'},
        {ky: 'queries_with_error', label: 'Queries with error'},
        {ky: 'average_query_duration', label: 'Average query duration'},
        {ky: 'longest_query_duration', label: 'Longest query duration'},
    ]},
    {ky: 'title2', title: 'WATCHER', labels: [
        {ky: 'watcher_failed', label: 'Watcher failed'},
    ]},
    {ky: 'title3', title: 'GARBAGE', labels: [
        {ky: 'garbage_collected', label: 'Garbage collected'},
    ]},
    {ky: 'title4', title: 'EVENTS', labels: [
        {ky: 'events_with_gap', label: 'Events with gap'},
        {ky: 'events_skipped', label: 'Events skipped'},
        {ky: 'events_failed', label: 'Events failed'},
        {ky: 'events_killed', label: 'Events killed'},
        {ky: 'events_committed', label: 'Events committed'},
        {ky: 'events_quorum_lost', label: 'Events quorum lost'},
        {ky: 'events_unaligned', label: 'Events unaligned'},
        {ky: 'longest_event_duration', label: 'Longest event duration'},
        {ky: 'average_event_duration', label: 'Average event duration'},
    ]}
];

const Counters = ({nodeId, offline, counters}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getCounters(nodeId); // update of the selected node; to get the latest info
    };

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} className={classes.overflow}>
                <Info header={header} content={counters} />
            </Grid>
            {offline ? null : (
                <Grid item container xs={12} spacing={1} >
                    <Grid item>
                        <CountersReset nodeId={nodeId} />
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" onClick={handleRefresh} >
                            <RefreshIcon color="primary" />
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Grid>

    );
};

Counters.propTypes = {
    nodeId: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,

    /* nodes properties */
    counters: NodesStore.types.counters.isRequired,
};

export default withStores(Counters);