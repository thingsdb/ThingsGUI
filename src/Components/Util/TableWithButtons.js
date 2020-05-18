import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const TableWithButtons = ({header, rows, rowClick, buttons}) => {
    const handleClickRow = (row) => () => {
        rowClick(row);
    };

    return (
        <Table padding="none">
            <TableHead>
                <TableRow>
                    {header.map((h, i) => (
                        <TableCell key={h.ky} align={i?'right':'left'}>
                            <Typography variant="caption" align={i?'right':'left'}>
                                {h.label}
                            </Typography>
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
                                <Typography component="div">
                                    <Box fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                        {row[h.ky]}
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
};
TableWithButtons.defaultProps = {
    buttons: null,
};

TableWithButtons.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowClick: PropTypes.func.isRequired,
    buttons: PropTypes.func,
};

export default TableWithButtons;