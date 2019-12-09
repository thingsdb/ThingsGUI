import PropTypes from 'prop-types';
import React from 'react';
import { Info } from '../../Util';


const Counters = ({counters}) => {

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

    return (
        <Info header={header} content={counters} />
    );
};

Counters.propTypes = {
    counters: PropTypes.object.isRequired
};

export default Counters;