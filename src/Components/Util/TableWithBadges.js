import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const TableWithBadges = ({header, rows, badgeButton, buttons}) => {
    const [index, setIndex] = React.useState(null);

    const mouseEnter = (i) => () => {
        setIndex(i);
        console.log(i)
    };
    const mouseLeave = () => {
        setIndex(null);
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
                    <TableRow hover={badgeButton!==null} key={ri} onMouseEnter={mouseEnter(ri)} onMouseLeave={mouseLeave}>
                        {header.map((h, i) => (
                            <TableCell key={h.ky} align={i?'right':'left'}>
                                <Typography component="div">
                                    <Badge
                                        badgeContent={
                                            badgeButton&&index==ri?badgeButton(h, row, ri):null
                                        }
                                    >
                                        <Box fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                            {row[h.ky]}
                                        </Box>
                                    </Badge>
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
TableWithBadges.defaultProps = {
    buttons: null,
    badgeButton: null,
};

TableWithBadges.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    buttons: PropTypes.func,
    batchButton: PropTypes.func,
};

export default TableWithBadges;