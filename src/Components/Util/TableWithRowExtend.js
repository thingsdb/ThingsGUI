import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    row: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    collapse: {
        backgroundColor: '#191D1F',
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
}));

const Tabel = ({header, rows, rowExtend}) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState(null);

    const handleClickRow = (ri) => () => {
        setSelected(ri!==selected?ri:null);
    };

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
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ri) => {
                        const isopen = selected===ri;
                        return (
                            <React.Fragment key={ri}>
                                <TableRow className={classes.row} onClick={handleClickRow(ri)}>
                                    {header.map((h, i) => (
                                        <TableCell key={h.ky} align={i?'right':'left'} style={{borderBottom: isopen?'none':null}}>
                                            {row[h.ky]}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right" style={{borderBottom: isopen?'none':null}}>
                                        {isopen ? <ExpandLess /> : <ExpandMore />}
                                    </TableCell>
                                </TableRow>
                                {isopen ? (
                                    <TableRow className={classes.collapse} style={{display: isopen?null:'none', borderBottom: 'none'}}>
                                        <TableCell colSpan={12}>
                                            <Collapse hidden={!isopen} in={isopen}>
                                                {rowExtend(row)}
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>

                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

Tabel.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowExtend: PropTypes.func.isRequired,
};

export default Tabel;