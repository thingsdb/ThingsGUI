import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import Paper from '@mui/material/Paper';
import React from 'react';
import Typography from '@mui/material/Typography';

import { getGreetingTime, getSorting, stableSort, TitlePage3 } from '../Util';
import { ProcedureActions, ProcedureStore, ThingsdbActions, ThingsdbStore, TimerActions, TimerStore } from '../../Stores';
import { THINGSDB_SCOPE } from '../../Constants/Scopes';
import CollectionCard from './CollectionCard';
import ProcedureCard from './ProcedureCard';
import TimerCard from './TimerCard';
import UserCard from './UserCard';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}, {
    store: ProcedureStore,
    keys: ['procedures']
}, {
    store: TimerStore,
    keys: ['timers']
}]);


const scope = THINGSDB_SCOPE;

const Welcome = ({collections, procedures, timers, user, users}) => {

    React.useEffect(() => {
        ThingsdbActions.getCollections();
        ProcedureActions.getProcedures();
        TimerActions.getTimers();
        ThingsdbActions.getUsers();
        ThingsdbActions.getUser();
    }, []);

    let humanizedGreeting = 'Good ' + getGreetingTime(moment()) + ', ';
    let sortedCollections = stableSort(collections, getSorting('desc', 'things'));

    return (
        <TitlePage3
            preTitle={humanizedGreeting}
            title={user.name || ''}
            content={
                <React.Fragment>
                    {sortedCollections.length > 0 &&
                        <Paper sx={{padding: '16px', width: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} key={'collections_intro'}>
                                    <Typography gutterBottom variant="button" component="h2" color="textSecondary">
                                        {'Your collections:'}
                                    </Typography>
                                </Grid>
                                {sortedCollections.map((collection, index) => (
                                    <Grid item key={index}>
                                        <CollectionCard collection={collection} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    }
                    {users.length > 0 &&
                        <Paper sx={{padding: '16px', width: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} key={'users_intro'}>
                                    <Typography gutterBottom variant="button" component="h2" color="textSecondary">
                                        {'Users:'}
                                    </Typography>
                                </Grid>
                                {users.map((user, index) => (
                                    <Grid item key={index}>
                                        <UserCard user={user} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    }
                    {procedures[scope] && procedures[scope].length > 0 &&
                        <Paper sx={{padding: '16px', width: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} key={'procedures_intro'}>
                                    <Typography gutterBottom variant="button" component="h2" color="textSecondary">
                                        {'Procedures:'}
                                    </Typography>
                                </Grid>
                                {procedures[scope].map((procedure, index) => (
                                    <Grid item key={index}>
                                        <ProcedureCard procedure={procedure} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    }
                    {timers[scope] && timers[scope].length > 0 &&
                        <Paper sx={{margin: '4px 4px 48px 4px', padding: '16px', width: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} key={'timers_intro'}>
                                    <Typography gutterBottom variant="button" component="h2" color="textSecondary">
                                        {'Timers:'}
                                    </Typography>
                                </Grid>
                                {timers[scope].map((timer, index) => (
                                    <Grid item key={index}>
                                        <TimerCard timer={timer} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    }
                </React.Fragment>
            }
        />
    );
};

Welcome.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,

    /* Timers properties */
    timers: TimerStore.types.timers.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Welcome);
