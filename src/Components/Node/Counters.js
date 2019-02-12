import Grid from '@material-ui/core/Grid';
import React from 'react';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';

import {ApplicationStore} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['counters'],
});

class Counters extends React.Component {
    
    // render() {
    //     const {counters} = this.props;
        
    //     const rows = counters ? Object.entries(counters) : [];
        
    //     return (
    //         <React.Fragment>
    //             <Table>
    //                 <TableHead>
    //                     <TableRow>
    //                         <TableCell>
    //                             {'Counter'}
    //                         </TableCell>
    //                         <TableCell align="right">
    //                             {'Value'}
    //                         </TableCell>
    //                     </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                     {rows.map(([k, v]) => (
    //                         <TableRow key={k}>
    //                             <TableCell component="th" scope="row">
    //                                 {k}
    //                             </TableCell>
    //                             <TableCell align="right">
    //                                 {v}
    //                             </TableCell>
    //                         </TableRow>
    //                     ))}
    //                 </TableBody>
    //             </Table>
    //         </React.Fragment>
    //     );
    // }

    render() {
        const {counters} = this.props;

        const header = [
            {kiey: 'queries_received', label: 'Queries received'},
            {kiey: 'events_with_gap', label: 'Events with gap'},
            {kiey: 'events_skipped', label: 'Events skipped'},
            {kiey: 'events_failed', label: 'Events failed'},
            {kiey: 'events_killed', label: 'Events killed'},
            {kiey: 'events_committed', label: 'Events committed'},
            {kiey: 'events_quorum_lost', label: 'Events quorumlost'},
            {kiey: 'events_unaligned', label: 'Events unaligned'},
            {kiey: 'garbage_collected', label: 'Garbage collected'},
            {kiey: 'longest_event_duration', label: 'Longest eventduration'},
            {kiey: 'average_event_duration', label: 'Average event duration'},
        ];
        
        return (
            <Grid container spacing={0}>
                {header.map((h) => (
                    <React.Fragment key={h.kiey}>
                        <Grid item xs={3}>
                            <Typography>
                                {h.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography>
                                {counters[h.kiey]}
                            </Typography>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        );
    }
}

Counters.propTypes = {
    counters: ApplicationStore.types.counters.isRequired
};

export default withStores(Counters);