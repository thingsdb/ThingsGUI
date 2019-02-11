/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withVlow} from 'vlow';

import {ApplicationStore} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['counters'],
});

class Counters extends React.Component {
    
    render() {
        const {counters} = this.props;
        
        const rows = counters ? Object.entries(counters) : [];
        
        return (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {'Counter'}
                            </TableCell>
                            <TableCell align="right">
                                {'Value'}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(([k, v]) => (
                            <TableRow key={k}>
                                <TableCell component="th" scope="row">
                                    {k}
                                </TableCell>
                                <TableCell align="right">
                                    {v}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    }
}

Counters.propTypes = {
    counters: ApplicationStore.types.counters.isRequired
};

export default withStores(Counters);