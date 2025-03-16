import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';


const TableWithButtons = ({
    header,
    rows,
    buttons = null,
}: Props) => (
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
                            <Typography component="div" align={i?'center':'left'} noWrap display="block">
                                <Box sx={{fontSize: 'body1.fontSize', fontFamily: 'Monospace', m: 1}}>
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

TableWithButtons.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    buttons: PropTypes.func,
};

export default TableWithButtons;

interface Props {
    header: {
        ky: string;
        label: string;
        fn?: (d: unknown) => React.ReactNode;
    }[];
    rows: object[];
    buttons: (row: any) => React.ReactNode;
}
