/* eslint-disable react/no-multi-comp */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import Add from './Add';
import RemoveExpired from './RemoveExpired';
import Remove from './Remove';
import RefWrap from './RefWrap';
import {ErrorMsg, HarmonicCard} from '../../Util';


const useStyles = makeStyles(theme => ({
    copyButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textfield: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 175,
    },
}));

const tag = '14';

const Tokens = ({user}) => {
    const classes = useStyles();
    const rows = user.tokens;
    const header = [{
        ky: 'created_on',
        label: 'Created on (UTC time)',
    }, {
        ky: 'description',
        label: 'Description',
    }, {
        ky: 'expiration_time',
        label: 'Expiration (UTC time)',
    }, {
        ky: 'key',
        label: 'Key',
    }, {
        ky: 'status',
        label: 'Status',
    }];

    const handleRef = (r) => () => {
        r.current.focus();
        r.current.select();
        document.execCommand('copy');
    };

    return (
        <HarmonicCard
            expand={false}
            title="TOKENS"
            content={user.tokens.length ? (
                <React.Fragment>
                    <ErrorMsg tag={tag} />
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
                                <TableRow key={ri}>
                                    {header.map((h, i) => (
                                        <TableCell key={h.ky} align={i?'right':'left'}>
                                            <Typography component="div">
                                                {h.ky=='key' ? (
                                                    <RefWrap>
                                                        {(reference) => (
                                                            <React.Fragment>
                                                                <TextField
                                                                    className={classes.textfield}
                                                                    name="queryString"
                                                                    type="text"
                                                                    value={row[h.ky]}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                        disableUnderline: true,
                                                                    }}
                                                                    inputProps={{
                                                                        style: {
                                                                            fontFamily: 'monospace',
                                                                            fontSize: 'body1.fontSize'
                                                                        },
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    inputRef={reference}
                                                                />
                                                                <Tooltip className={classes.copyButton} disableFocusListener disableTouchListener title="Copy to Clipboard">
                                                                    <Button onClick={handleRef(reference)}>
                                                                        <FileCopyIcon color="primary" />
                                                                    </Button>
                                                                </Tooltip>
                                                            </React.Fragment>
                                                        )}
                                                    </RefWrap>
                                                ) : (
                                                    <Box fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                                        {row[h.ky]}
                                                    </Box>
                                                )}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                    <TableCell align='right'>
                                        <Remove token={row} tag={tag} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </React.Fragment>
            ) : user.has_password ? (
                <Typography>
                    {'Not set.'}
                </Typography>
            ) : (
                <Typography color="error">
                    {`This user had no password set. Set a token or password to prevent ${user.name} from getting locked out.`}
                </Typography>
            )}
            buttons={
                <React.Fragment>
                    <RemoveExpired tag={tag} />
                    <Add user={user} />
                </React.Fragment>
            }
        />
    );
};

Tokens.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Tokens;