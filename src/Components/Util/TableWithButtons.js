import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const Tabel = ({header, rows, rowClick, buttons}) => {

    const handleClickRow = (row) => () => {
        rowClick(row);
    };

    return (
        <React.Fragment>
            <Table >
                <TableHead>
                    <TableRow>
                        {header.map((h, i) => (
                            <TableCell key={h.ky} align={i?'right':'left'}>
                                {h.label}
                            </TableCell>
                        ))}
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ri) => (
                        <TableRow key={ri} onClick={handleClickRow(row)}>
                            {header.map((h, i) => (
                                <TableCell key={h.ky} align={i?'right':'left'}>
                                    {row[h.ky]}
                                </TableCell>
                            ))}
                            <TableCell align='right'>
                                {buttons(row)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

Tabel.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowClick: PropTypes.func.isRequired,
    buttons: PropTypes.func.isRequired,
};

export default withStyles(styles)(Tabel);