import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import GrantUser from './Grant';
import RevokeUser from './Revoke';
import ServerError from '../Util/ServerError';


const User = ({user}) => {
    const [serverError, setServerError] = React.useState('');

    const handleServerError = (err) => {
        setServerError(err);
    }

    const handleCloseError = () => {
        setServerError('');
    }

    const openError = Boolean(serverError); 
    return (
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <PasswordUser user={user} />
            <RenameUser user={user} />
            <RemoveUser user={user} onServerError={handleServerError} />

            <Typography variant="h6" >
                {'Access'}
            </Typography>
            <Grid container spacing={0}>
                {user.access.map(({target, privileges}) => (
                    <React.Fragment key={target}>
                        <Grid item xs={3}>
                            <Typography>
                                {target}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography>
                                {privileges}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            {privileges !== 'NO_ACCESS' &&
                            <RevokeUser user={user} target={target} privileges={privileges} onServerError={handleServerError} />
                            }
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
            <GrantUser user={user} />

        </React.Fragment>
    );
};

User.propTypes = {
    user: PropTypes.object.isRequired,
};

export default User;