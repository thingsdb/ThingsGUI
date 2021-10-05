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

import { Copy, ErrorMsg, HarmonicCard } from '../../Util';
import { TokensTAG } from '../../../Constants/Tags';
import Add from './Add';
import Remove from './Remove';
import RemoveExpired from './RemoveExpired';


const tag = TokensTAG;

const Tokens = ({user}) => {
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
                                    <TableCell key={h.ky} align="left">
                                        <Typography variant="caption" align="left">
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
                                    {header.map((h) => {
                                        const isKey = h.ky === 'key';
                                        return (
                                            <TableCell key={h.ky} align="left">
                                                <Typography component="div">
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            fontSize: 'body1.fontSize',
                                                            fontFamily: 'Monospace',
                                                            m: 1,
                                                            marginLeft: 0
                                                        }}
                                                    >
                                                        {row[h.ky]}
                                                    </Box>
                                                    {isKey && <Copy text={row[h.ky]} />}
                                                </Typography>
                                            </TableCell>
                                        );
                                    })}
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
                <Typography variant="caption" sx={{color: amber[700]}}>
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