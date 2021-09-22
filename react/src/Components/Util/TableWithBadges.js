import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles(() => ({
    box: {
        maxWidth: 300,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    container: {
        maxHeight: 300,
    },
    emptyCell: {
        width: 50
    }
}));

const TableWithBadges = ({header, rows, badgeButton, buttons}) => {
    const classes = useStyles();
    const [index, setIndex] = React.useState(null);

    const mouseEnter = (i) => () => {
        setIndex(i);
    };
    const mouseLeave = () => {
        setIndex(null);
    };

    return (
        <TableContainer className={classes.container}>
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
                                        <Box className={classes.box} component="div" fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                            {row[h.ky]}
                                        </Box>
                                    </Badge>
                                </TableCell>
                            ))}
                            {buttons ? (
                                <TableCell align='right'>
                                    {buttons(row)}
                                </TableCell>
                            ) : <TableCell className={classes.emptyCell} />}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
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
    badgeButton: PropTypes.func,
};

export default TableWithBadges;