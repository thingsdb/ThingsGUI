import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    row: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
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

const Tabel = ({buttons, header, rows, rowExtend}) => {
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
                        <TableCell colSpan={2} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ri) => {
                        const isopen = selected===ri;
                        return (
                            <React.Fragment key={ri}>
                                <TableRow className={classes.row} >
                                    {header.map((h, i) => (
                                        <TableCell key={h.ky} align={i?'right':'left'} style={{borderBottom: isopen?'none':null}}>
                                            {row[h.ky]}
                                        </TableCell>
                                    ))}
                                    {buttons ? (
                                        <TableCell align='right' style={{borderBottom: isopen?'none':null}}>
                                            {buttons(row)}
                                        </TableCell>
                                    ) : null}
                                    <TableCell align="right" style={{borderBottom: isopen?'none':null}}>
                                        <IconButton onClick={handleClickRow(ri)}>
                                            {isopen ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                {isopen ? (
                                    <TableRow className={classes.collapse} style={{borderBottom: 'none'}}>
                                        <TableCell colSpan={12}>
                                            <Collapse in={isopen} timeout="auto" unmountOnExit>
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

Tabel.defaultProps = {
    buttons: null,
};

Tabel.propTypes = {
    buttons: PropTypes.func,
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowExtend: PropTypes.func.isRequired,
};

export default Tabel;