/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import AddThings from './AddThings';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {EventStore} from '../../Stores/BaseStore';
import {WatchThings} from '../Util';

import Thing from './Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}, {
    store: EventStore,
}]);


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
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
}));

const ThingRoot = ({things, collection}) => {
    const classes = useStyles();
    const fetched = things.hasOwnProperty(collection.collection_id);

    React.useEffect(() => {
        CollectionActions.query(collection);
        // return () => CollectionActions.cleanupTmp();
    }, [collection.name]);

    return (
        <React.Fragment>
            {fetched ? (
                <List
                    component="nav"
                    className={classes.root}
                    dense
                    disablePadding
                >
                    {Object.entries(things[collection.collection_id]).map(([k, v]) => k === '#' ? null : (
                        <React.Fragment key={k}>
                            <Thing
                                className={classes.thing}
                                id={collection.collection_id}
                                thing={v}
                                collection={collection}
                                parent={{
                                    id: collection.collection_id,
                                    name: 'root',
                                    type: 'object',
                                    isTuple: false,
                                }}
                                child={{
                                    name: k,
                                    index: null,
                                }}
                            />
                        </React.Fragment>
                    ))}
                    <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <AddThings
                                child={{
                                    index: null,
                                    name: '',
                                }}
                                parent={{
                                    id: collection.collection_id,
                                    name: '',
                                    type: 'object',
                                }}
                                scope={`@collection:${collection.name}`}
                                thing={things[collection.collection_id]}
                            />
                        </ListItemIcon>
                        <ListItemIcon className={classes.icon}>
                            <WatchThings
                                buttonIsFab={false}
                                scope={`@collection:${collection.name}`}
                                thingId={collection.collection_id}
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
            )}
        </React.Fragment>
    );
};

ThingRoot.propTypes = {
    collection: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};


export default withStores(ThingRoot);