import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ConnectedIcon from '@material-ui/icons/Power';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {StartStopPolling} from '../Util';


const useStyles = makeStyles(() => ({
    row: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
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
    },
}));

const Tabel = ({buttons, header, rows, rowExtend, connectedNode, onRefresh}) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState(null);

    const handleClickRow = (ri) => () => {
        setSelected(ri!==selected?ri:null);
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell size="small" colSpan={1} />
                    {header.map((h, i) => (
                        <TableCell key={h.ky} align={i?'right':'left'}>
                            {h.label}
                        </TableCell>
                    ))}
                    <TableCell size="small" colSpan={buttons&&rows.length ? buttons(rows[0]).length : 1} align="right">
                        {onRefresh&&(
                            <Tooltip disableFocusListener disableTouchListener title="Refresh nodes info">
                                <Button color="primary" onClick={onRefresh}>
                                    <RefreshIcon color="primary" />
                                </Button>
                            </Tooltip>
                        )}
                    </TableCell>
                    {onRefresh&&(
                        <TableCell size="small" align="right">
                            <StartStopPolling onPoll={onRefresh} title="nodes info" />
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, ri) => {
                    const isopen = selected===ri;
                    return (
                        <React.Fragment key={ri}>
                            <TableRow className={classes.row} >
                                <TableCell size="small" align='right' style={{borderBottom: isopen?'none':null}}>
                                    {row.node_id == connectedNode.node_id && <ConnectedIcon />}
                                </TableCell>
                                {header.map((h, i) => (
                                    <TableCell size="small" key={h.ky} align={i?'right':'left'} style={{borderBottom: isopen?'none':null}}>
                                        <Typography variant="inherit" color={row[h.ky] == 'OFFLINE' ? 'error' : 'inherit'}>
                                            {row[h.ky]}
                                        </Typography>
                                    </TableCell>
                                ))}
                                {buttons ? (
                                    buttons(row).map((r, i) => (
                                        <TableCell size="small" key={i} align='right' style={{borderBottom: isopen?'none':null}}>
                                            {r}
                                        </TableCell>
                                    ))
                                ) : null}
                                <TableCell size="small" align="right" style={{borderBottom: isopen?'none':null}}>
                                    <Button color="primary" onClick={handleClickRow(ri)}>
                                        {isopen ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            {isopen ? (
                                <TableRow className={classes.collapse} style={{borderBottom: 'none'}}>
                                    <TableCell size="small" colSpan={12}>
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
    );
};

Tabel.defaultProps = {
    buttons: null,
    onRefresh: null,
};

Tabel.propTypes = {
    buttons: PropTypes.func,
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowExtend: PropTypes.func.isRequired,
    connectedNode: PropTypes.object.isRequired,
    onRefresh: PropTypes.func,
};

export default Tabel;