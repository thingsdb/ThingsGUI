/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { Buttons } from '../Utils';
import { Info, scaleToBinBytes } from '../../Util';
import {NodesActions, NodesStore} from '../../../Stores';
import CountersReset from './CountersReset';

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
        {ky: 'average_query_duration', label: 'Average query duration', fn: (d) => d.toFixed(3) + ' s'},
        {ky: 'longest_query_duration', label: 'Longest query duration', fn: (d) => d.toFixed(3) + ' s'},
        {ky: 'largest_result_size', label: 'Largest result size', fn: scaleToBinBytes},
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
        {ky: 'longest_event_duration', label: 'Longest event duration', fn: (d) => d.toFixed(3) + ' s'},
        {ky: 'average_event_duration', label: 'Average event duration', fn: (d) => d.toFixed(3) + ' s'},
    ]}
];

const link = 'https://docs.thingsdb.net/v0/node-api/counters/';

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
            <Grid container item xs={12} justify="flex-end">
                <Box fontSize={10} fontStyle="italic" m={1}>
                    {`Last reset at: ${moment(counters.started_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                </Box>
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<CountersReset key="counters_reset_button" nodeId={nodeId} />]}
                    link={link}
                    onRefresh={handleRefresh}
                />
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