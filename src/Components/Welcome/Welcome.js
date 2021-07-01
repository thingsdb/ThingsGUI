import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {ThingsdbStore} from '../../Stores';
import {getGreetingTime, getSorting, stableSort, TitlePage} from '../Util';
import CollectionCard from './CollectionCard';
import UserCard from './UserCard';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(2),
        width: '100%'
    },
}));

const Welcome = ({collections, user, users}) => {
    const classes = useStyles();
    let humanizedGreeting = 'Good ' + getGreetingTime(moment()) + ', ';
    let sortedCollections = stableSort(collections, getSorting('desc', 'things'));

    return (
        <TitlePage
            preTitle={humanizedGreeting}
            title={user.name}
            content={
                <Paper className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} key={'collections_intro'}>
                            <Typography gutterBottom variant="h6" component="h2" color="textSecondary">
                                {'Your collections:'}
                            </Typography>
                        </Grid>
                        {sortedCollections.map((collection, index) => (
                            <Grid item key={index}>
                                <CollectionCard
                                    collection={collection}
                                    // size={index === 0 ? 'big' : 'default'}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} key={'users_intro'}>
                            <Typography gutterBottom variant="h6" component="h2" color="textSecondary">
                                {'Users:'}
                            </Typography>
                        </Grid>
                        {users.map((user, index) => (
                            <Grid item key={index}>
                                <UserCard
                                    user={user}
                                    // size={index === 0 ? 'big' : 'default'}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            }
        />
    );
};

Welcome.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Welcome);
