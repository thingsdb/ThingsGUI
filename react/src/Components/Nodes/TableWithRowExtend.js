import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ConnectedIcon from '@mui/icons-material/Power';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {StartStopPolling} from '../Utils';


const Tabel = ({
    buttons = null,
    canExtend = () => true,
    header,
    rows,
    rowExtend,
    connectedNode,
    onRefresh = null,
}) => {
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
                        {onRefresh && (
                            <Tooltip disableFocusListener disableTouchListener title="Refresh nodes info">
                                <Button color="primary" onClick={onRefresh}>
                                    <RefreshIcon color="primary" />
                                </Button>
                            </Tooltip>
                        )}
                    </TableCell>
                    {onRefresh && (
                        <TableCell size="small" align="right">
                            <StartStopPolling onPoll={onRefresh} title="nodes info" />
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, ri) => {
                    const isopen = selected === ri;
                    return (
                        <React.Fragment key={ri}>
                            <TableRow selected={isopen}>
                                <TableCell size="small" align='right'>
                                    {row.node_id == connectedNode.node_id && <ConnectedIcon />}
                                </TableCell>
                                {header.map((h, i) => (
                                    <TableCell size="small" key={h.ky} align={i ? 'right' : 'left'}>
                                        <Typography variant="inherit" color={h.color(row[h.ky])}>
                                            {row[h.ky]}
                                        </Typography>
                                    </TableCell>
                                ))}
                                {buttons ? (
                                    buttons(row).map((r, i) => (
                                        <TableCell size="small" key={i} align='right'>
                                            {r}
                                        </TableCell>
                                    ))
                                ) : null}
                                <TableCell size="small" align="right">
                                    {canExtend(row) &&
                                        <Button color="primary" onClick={handleClickRow(ri)}>
                                            {isopen ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                            {isopen ? (
                                <TableRow
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, .125)',
                                    }}
                                >
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

Tabel.propTypes = {
    buttons: PropTypes.func,
    canExtend: PropTypes.func,
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowExtend: PropTypes.func.isRequired,
    connectedNode: PropTypes.object.isRequired,
    onRefresh: PropTypes.func,
};

export default Tabel;