import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';


const TableWithBadges = ({
    header,
    rows,
    badgeButton = null,
    buttons = null,
}: Props) => {
    const [index, setIndex] = React.useState(null);

    const mouseEnter = (i) => () => {
        setIndex(i);
    };
    const mouseLeave = () => {
        setIndex(null);
    };

    return (
        <TableContainer sx={{maxHeight: '300px'}}>
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
                        <TableRow key={ri} onMouseEnter={mouseEnter(ri)} onMouseLeave={mouseLeave}>
                            {header.map((h, i) => (
                                <TableCell key={h.ky} align={i?'right':'left'}>
                                    <Badge
                                        badgeContent={
                                            badgeButton&&index==ri?badgeButton(h, row, ri):null
                                        }
                                    >
                                        <Box
                                            component="div"
                                            sx={{
                                                fontSize: 'body1.fontSize',
                                                fontFamily: 'Monospace',
                                                m: 1,
                                                maxWidth: '300px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {row[h.ky]}
                                        </Box>
                                    </Badge>
                                </TableCell>
                            ))}
                            {buttons ? (
                                <TableCell align='right'>
                                    {buttons(row)}
                                </TableCell>
                            ) : <TableCell sx={{width: '50px'}} />}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TableWithBadges.propTypes = {
    badgeButton: PropTypes.func,
    buttons: PropTypes.func,
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TableWithBadges;

interface Props {
    badgeButton: (header: object, row: object, i: number) => React.ReactElement;
    buttons: (row: any) => React.ReactElement;
    header: {
        ky: string;
        label: string;
    }[];
    rows: object[];
}
