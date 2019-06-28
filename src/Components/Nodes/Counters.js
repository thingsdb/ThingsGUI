import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


const Counters = ({counters}) => {
    
    const header = [
        {ky: 'queries_received', label: 'Queries received'},
        {ky: 'events_with_gap', label: 'Events with gap'},
        {ky: 'events_skipped', label: 'Events skipped'},
        {ky: 'events_failed', label: 'Events failed'},
        {ky: 'events_killed', label: 'Events killed'},
        {ky: 'events_committed', label: 'Events committed'},
        {ky: 'events_quorum_lost', label: 'Events quorumlost'},
        {ky: 'events_unaligned', label: 'Events unaligned'},
        {ky: 'garbage_collected', label: 'Garbage collected'},
        {ky: 'longest_event_duration', label: 'Longest eventduration'},
        {ky: 'average_event_duration', label: 'Average event duration'},
    ];
    
    return (
        <Grid container spacing={0}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={3}>
                        <Typography>
                            {h.label}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
                            {counters[h.ky]}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    );
};

Counters.propTypes = {
    counters: PropTypes.object.isRequired
};

export default Counters;