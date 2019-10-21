/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import AddToken from './AddToken';
import RemoveExpired from './RemoveExpired';
import RemoveToken from './RemoveToken';
import {HarmonicCard, TableWithButtons} from '../Util';


const Tokens = ({user}) => {

    const rows = user.tokens;
    const header = [{
        ky: 'description',
        label: 'Description',
    }, {
        ky: 'expiration_time',
        label: 'Expiration UTC time',
    }, {
        ky: 'key',
        label: 'Key',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const handleRowClick = () => null;

    const handleButtons = (token) => <RemoveToken token={token} />;

    return (
        <HarmonicCard
            title="TOKENS"
            content={
                <React.Fragment>
                    {user.tokens.length ? (
                        <TableWithButtons header={header} rows={rows} rowClick={handleRowClick} buttons={handleButtons} />
                    ) : user.has_password ? (
                        <Typography>
                            {'Not set.'}
                        </Typography>
                    ) : (
                        <Typography color="error">
                            {`This user had no password set. Set a token or password to prevent ${user.name} from getting locked out.`}
                        </Typography>
                    )}
                </React.Fragment>
            }
            buttons={
                <React.Fragment>
                    <RemoveExpired />
                    <AddToken user={user} />
                </React.Fragment>
            }
        />
    );
};

Tokens.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Tokens;