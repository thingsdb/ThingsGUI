import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import GrantUser from './Grant';
import RevokeUser from './Revoke';


const User = ({user}) => {
    return (
        <React.Fragment>
            {/* <Typography>
                {user.name}
            </Typography> */}

            <PasswordUser user={user} />
            <RenameUser user={user} />
            <RemoveUser user={user} />

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
                            <RevokeUser user={user} target={target} privileges={privileges} />
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