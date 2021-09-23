import { amber } from '@mui/material/colors';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import Add from './Add';
import RemoveExpired from './RemoveExpired';
import Remove from './Remove';
import {Copy, ErrorMsg, HarmonicCard} from '../../Util';
import {TokensTAG} from '../../../Constants/Tags';

const useStyles = makeStyles(theme => ({
    box: {
        marginLeft: 0,
    },
    copyButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    key: {
        marginLeft: 0,
        marginRight: theme.spacing(1),
        width: 175,
    },
    warnColor: {
        color: amber[700],
    },
}));

const tag = TokensTAG;

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

    return (
        <HarmonicCard
            title="TOKENS"
            content={user.tokens.length ? (
                <React.Fragment>
                    <ErrorMsg tag={tag} />
                    <Table padding="none">
                        <TableHead>
                            <TableRow>
                                {header.map((h) => (
                                    <TableCell key={h.ky} align={'left'}>
                                        <Typography variant="caption" align={'left'}>
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
                                    {header.map((h) => (
                                        <TableCell key={h.ky} align={'left'}>
                                            <Typography component="div">
                                                <Box
                                                    component="span"
                                                    className={h.ky === 'key' ? classes.key : classes.box}
                                                    sx={{fontSize: 'body1.fontSize', fontFamily: 'Monospace', m: 1}}
                                                >
                                                    {row[h.ky]}
                                                </Box>
                                                {h.ky === 'key' && <Copy text={row[h.ky]} />}
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
                <Typography variant="caption" className={classes.warnColor}>
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