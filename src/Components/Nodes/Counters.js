import PropTypes from 'prop-types';
import React from 'react';
import { Info } from '../Util';


const Counters = ({counters}) => {
    const header = [
        {ky: 'title1', title: '[TITLE1]', labels: [
            {ky: 'queries_success', label: 'Succesfull queries'},
            {ky: 'queries_with_error', label: 'Queries with error'},
            {ky: 'garbage_collected', label: 'Garbage collected'},
            {ky: 'longest_event_duration', label: 'Longest event duration'},
            {ky: 'average_event_duration', label: 'Average event duration'},
        ]},
        {ky: 'title2', title: '[TITLE2]', labels: [
            {ky: 'events_with_gap', label: 'Events with gap'},
            {ky: 'events_skipped', label: 'Events skipped'},
            {ky: 'events_failed', label: 'Events failed'},
            {ky: 'events_killed', label: 'Events killed'},
            {ky: 'events_committed', label: 'Events committed'},
            {ky: 'events_quorum_lost', label: 'Events quorumlost'},
            {ky: 'events_unaligned', label: 'Events unaligned'},
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