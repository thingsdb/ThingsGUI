import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core';

import {EventStore} from '../../Stores/BaseStore';
import {QueryOutput} from '../Util';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchThings']
}]);

const useStyles = makeStyles(theme => ({
    grid: {
        // maxHeight: '800px',
        // overflowY: 'auto',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

const Watcher = ({watchThings}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={2} className={classes.grid}>
            {Object.entries(watchThings).map(([k, v]) => k === '#' ? null : (
                <Grid item xs={12} key={k}>
                    <QueryOutput output={v} />
                </Grid>
            ))}
        </Grid>
    );
};

Watcher.propTypes = {
    /* event properties */
    watchThings: EventStore.types.watchThings.isRequired,
};

export default withStores(Watcher);

// class ThingForGui(Thing):

//     def __init__(self, client):
//         self.client = client

//     def __new__(cls, *arg, **kwargs):
//         return Object.__new__()

//     async def on_init(self, event, data):
//         await socket.emit(self._collection._client, event, data)



// id=5 collection='stuff'

// thing = ThingForGui(id, collection)
