import Divider from '@material-ui/core/Divider';
import ExploreIcon from '@material-ui/icons/Explore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {ThingActions} from '../TreeActions';
import {EventStore, CollectionStore, CollectionActions} from '../../../../Stores';

import ThingRestrict from './ThingRestrict';
import Thing from './Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}, {
    store: EventStore,
    keys: ['watchIds']
}]);


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        paddingTop: theme.spacing(2),
    },
    thing: {
        paddingLeft: theme.spacing(6),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
    green: {
        color: theme.palette.primary.green,
    },
    divider: {
        marginTop: theme.spacing(2),
    }
}));

const ThingRoot = ({things, collection, watchIds}) => {
    const classes = useStyles();
    const fetched = things.hasOwnProperty(collection.collection_id);
    console.log(things)

    React.useEffect(() => {
        CollectionActions.getThings(collection.collection_id, collection.name);
    }, [collection.collection_id, collection.name]);

    const isWatching = Boolean(watchIds[collection.collection_id]);

    return (
        fetched ? (
            <List
                component="nav"
                className={classes.root}
                dense
                disablePadding
            >
                <ThingRestrict
                    thing={things[collection.collection_id]}
                    onChildren={(k, v) => (
                        <Thing
                            key={k}
                            className={classes.thing}
                            id={collection.collection_id}
                            thing={v}
                            things={things}
                            collection={collection}
                            parent={{
                                id: collection.collection_id,
                                name: 'root',
                                type: 'thing',
                                isTuple: false,
                            }}
                            child={{
                                name: k,
                                index: null,
                            }}
                            watchIds={watchIds}
                        />
                    )}
                />
                <Divider className={classes.divider} />
                <ListItem className={classes.listItem}>
                    {isWatching ? (
                        <ListItemIcon className={classes.icon}>
                            <ExploreIcon className={classes.green} />
                        </ListItemIcon>
                    ) : null}
                    <ListItemIcon className={classes.icon}>
                        <ThingActions
                            child={{
                                id: collection.collection_id,
                                index: null,
                                name: 'root',
                                type: 'thing',
                            }}
                            parent={{
                                id: null,
                                index: null,
                                name: '',
                                type: '',
                                isTuple: false,
                            }}
                            scope={`@collection:${collection.name}`}
                            thing={things[collection.collection_id]}
                            isRoot
                        />
                    </ListItemIcon>
                    {Object.entries(things[collection.collection_id]).length<2 ? (
                        <ListItemText primary="Add your first thing!" />
                    ) : null}
                </ListItem>
            </List>
        ) : (
            <Typography variant="caption">
                {'Cannot fetch data.'}
            </Typography>
        )
    );
};

ThingRoot.propTypes = {
    collection: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,

    // Event properties
    watchIds: EventStore.types.watchIds.isRequired,
};


export default withStores(ThingRoot);