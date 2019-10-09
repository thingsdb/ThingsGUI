import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import CollectionConfig from './CollectionConfig';
import CollectionTree from './CollectionTree';
import {CollectionStore} from '../../Stores/CollectionStore';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {findItem} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
}, {
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        width: '100%'
    },
    config: {
        marginLeft: theme.spacing(1),
        minWidth: '450px',
        width: '40%',
    },
    flex: {
        display: 'flex',
    },
    tree: {
        width: '60%',
    },
}));

const Collection = ({match, collections}) => {
    const classes = useStyles();

    const selectedCollection = findItem(match.index, collections);


    return (
        <div className={classes.root}>
            <div>
                <Card className={classes.title}>
                    <Typography variant="body1" >
                        {'Overview of: '}
                    </Typography>
                    <Typography variant="h4" color='primary'>
                        {selectedCollection.name}
                    </Typography>
                </Card>
            </div>
            <div className={classes.flex}>
                <div className={classes.tree}>
                    <CollectionTree collection={selectedCollection} />
                </div>
                <div className={classes.config}>
                    <CollectionConfig collection={selectedCollection} />
                </div>
            </div>
        </div>
    );
};

Collection.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};


export default withStores(Collection);