
import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import UserAccess from './UserAccess';
import Tokens from './Tokens';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        width: '100%'
    },
    user: {
        marginBottom: theme.spacing(1),
        minWidth: '450px',
        width: '100%',
    },
    tokens: {
        width: '100%',
    },
}));


const User = ({user, collections}) => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <div>
                <Card className={classes.card}>
                    <Typography variant="h6" >
                        {'Authentication of: '}
                    </Typography>
                    <Typography variant="h4" color='primary'>
                        {user.name}
                    </Typography>
                </Card>
            </div>
            <div>
                <div className={classes.user}>
                    <UserAccess user={user} collections={collections} />
                </div>
                <div className={classes.tokens}>
                    <Tokens user={user} />
                </div>
            </div>
        </div>
    );
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    collections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default User;