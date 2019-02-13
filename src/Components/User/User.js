import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import GrantUser from './Grant';
import RevokeUser from './Revoke';
import {ApplicationStore} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class User extends React.Component {
    
    render() {
        const {user} = this.props;
        
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
    }
}

User.propTypes = {
    // classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(User));