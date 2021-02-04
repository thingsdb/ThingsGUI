import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const TableWithButtons = ({header, rows, buttons}) => (
    <Table padding="none">
        <TableHead>
            <TableRow>
                {header.map((h, i) => (
                    <TableCell key={h.ky} align={i?'center':'left'}>
                        <Typography variant="caption" align={i?'center':'left'}>
                            {h.label}
                        </Typography>
                    </TableCell>
                ))}
                <TableCell />
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row, ri) => (
                <TableRow key={ri}>
                    {header.map((h, i) => (
                        <TableCell key={h.ky} align={i?'center':'left'}>
                            <Typography component="div" align={i?'center':'left'}>
                                <Box fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                    {h.fn ? h.fn(row[h.ky]) : row[h.ky]}
                                </Box>
                            </Typography>
                        </TableCell>
                    ))}
                    {buttons&& (
                        <TableCell align='right'>
                            {buttons(row)}
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

TableWithButtons.defaultProps = {
    buttons: null,
};

TableWithButtons.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    buttons: PropTypes.func,
};

export default TableWithButtons;