import { withVlow } from 'vlow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { Buttons } from '../Utils';
import { DATE_TIME_SEC_STR } from '../../../Constants/DateStrings';
import { Info, scaleToBinBytes } from '../../Utils';
import { NodesActions, NodesStore } from '../../../Stores';
import { THINGS_DOC_COUNTERS } from '../../../Constants/Links';
import CountersReset from './CountersReset';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['counters']
}]);


const header = [
    {ky: 'title1', title: 'GENERAL', labels: [
        {ky: 'started_at', label: 'Counters started at', fn: (t) => moment(t*1000).format(DATE_TIME_SEC_STR)},
    ]},
    {ky: 'title2', title: 'QUERIES', labels: [
        {ky: 'queries_success', label: 'Successful queries'},
        {ky: 'queries_with_error', label: 'Queries with error'},
        {ky: 'average_query_duration', label: 'Average query duration', fn: (d) => d && d.toFixed(3) + ' s'},
        {ky: 'longest_query_duration', label: 'Longest query duration', fn: (d) => d && d.toFixed(3) + ' s'},
        {ky: 'largest_result_size', label: 'Largest result size', fn: scaleToBinBytes},
        {ky: 'queries_from_cache', label: 'Queries from cache'},
        {ky: 'wasted_cache', label: 'Wasted cache'},
    ]},
    {ky: 'title3', title: 'GARBAGE', labels: [
        {ky: 'garbage_collected', label: 'Garbage collected'},
    ]},
    {ky: 'title4', title: 'CHANGES', labels: [
        {ky: 'changes_with_gap', label: 'Changes with gap'},
        {ky: 'changes_skipped', label: 'Changes skipped'},
        {ky: 'changes_failed', label: 'Changes failed'},
        {ky: 'changes_killed', label: 'Changes killed'},
        {ky: 'changes_committed', label: 'Changes committed'},
        {ky: 'quorum_lost', label: 'Changes quorum lost'},
        {ky: 'changes_unaligned', label: 'Changes unaligned'},
        {ky: 'longest_change_duration', label: 'Longest change duration', fn: (d) => d && d.toFixed(3) + ' s'},
        {ky: 'average_change_duration', label: 'Average change duration', fn: (d) => d && d.toFixed(3) + ' s'},
    ]},
    {ky: 'title5', title: 'TASKS', labels: [
        {ky: 'tasks_success', label: 'Successful tasks'},
        {ky: 'tasks_with_error', label: 'Tasks with error'},
    ]}
];

const link = THINGS_DOC_COUNTERS;

const Counters = ({nodeId, offline, counters}) => {

    const handleRefresh = () => {
        NodesActions.getCounters(nodeId); // update of the selected node; to get the latest info
    };

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} sx={{marginTop: '16px', overflowY: 'auto', maxHeight: '400px'}}>
                <Info header={header} content={counters} />
            </Grid>
            <Grid container item xs={12} justifyContent="flex-end">
                <Box sx={{fontSize: 10, fontStyle: 'italic', m: 1}}>
                    {`Last reset at: ${moment(counters.started_at*1000).format(DATE_TIME_SEC_STR)}`}
                </Box>
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<CountersReset key="counters_reset_button" nodeId={nodeId} />]}
                    link={link}
                    onRefresh={handleRefresh}
                    title="counters"
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