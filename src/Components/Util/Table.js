import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from '@material-ui/core/styles';

import AddCollection from '../Collection/Add';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Tabel extends React.Component {

    handleClickRow = (row) => () => {
        const {rowClick} = this.props;
        rowClick(row);
    }

    render() {
        const {header, rows} = this.props;
        
        return (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            {header.map((h, i) => (
                                <TableCell key={h.ky} align={i?'right':'left'}>
                                    {h.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, ri) => (
                            <TableRow key={ri} onClick={this.handleClickRow(row)}>
                                {header.map((h, i) => (
                                    <TableCell key={h.ky} align={i?'right':'left'}>
                                        {row[h.ky]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <AddCollection />
            </React.Fragment>
        );
    }
}

Tabel.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Tabel);