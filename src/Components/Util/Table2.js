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
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const Tabel = ({header, rows, rowExtend}) => {
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
                                <TableRow onClick={handleClickRow(ri)}>
                                    {header.map((h, i) => (
                                        <TableCell key={h.ky} align={i?'right':'left'} style={{borderBottom: isopen?'none':null}}>
                                            {row[h.ky]}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right" style={{borderBottom: isopen?'none':null}}>
                                        {isopen ? <ExpandLess /> : <ExpandMore />}
                                    </TableCell>
                                </TableRow>
                                {isopen &&
                                <TableRow style={{display: isopen?null:'none', borderBottom: 'none'}}>
                                    <TableCell colSpan={12}>
                                        <Collapse hidden={!isopen} in={isopen}>
                                            {rowExtend(row)}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>}
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

export default withStyles(styles)(Tabel);