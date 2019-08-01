import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';


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
        <Grid container spacing={1}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={12}>
                        <Typography variant={'caption'}>
                                {h.title + ':'}
                        </Typography>
                        <Divider />
                    </Grid>
                    {h.labels.map((l) => (
                        <React.Fragment key={l.ky}>
                            <Grid container item xs={12}>
                                <Grid item xs={6}>
                                    <Typography variant={'caption'}>
                                        {l.label + ':'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={'subtitle2'}>
                                        {counters[l.ky]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    ))}      
                </React.Fragment>
            ))}
        </Grid>
    );
};

Counters.propTypes = {
    counters: PropTypes.object.isRequired
};

export default Counters;