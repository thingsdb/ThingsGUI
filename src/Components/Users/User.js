import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';


import UserAccess from './UserAccess';
import Tokens from './Tokens';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {findItem, isObjectEmpty} from '../Util';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);

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
        minWidth: '900px',
        width: '100%',
    },
    tokens: {
        minWidth: '450px',
        width: '100%',
    },
}));


const User = ({match, user, users, collections}) => {
    const classes = useStyles();

    const users2 =
        users.length ? users
            : isObjectEmpty(user) ? []
                : [user];

    const selectedUser = findItem(match.index, users2); // TODO CHECK

    return (
        isObjectEmpty(selectedUser) ? null
            : (
                <div className={classes.root}>
                    <div>
                        <Card className={classes.card}>
                            <Typography variant="body1" >
                                {'Authentication of: '}
                            </Typography>
                            <Typography variant="h4" color='primary'>
                                {selectedUser.name}
                            </Typography>
                        </Card>
                    </div>
                    <div>
                        <div className={classes.user}>
                            <UserAccess user={selectedUser} collections={collections} />
                        </div>
                        <div className={classes.tokens}>
                            <Tokens user={selectedUser} />
                        </div>
                    </div>
                </div>
            )
    );
};

User.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(User);