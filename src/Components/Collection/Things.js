/* eslint-disable react/no-multi-comp */
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

import Thing from './Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
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
        CollectionActions.query(collection.collection_id);
    }, [collection.collection_id]);

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
                                info={{
                                    name: k,
                                    id: collection.collection_id,
                                    index: null,
                                    parentName: 'root',
                                    parentType: 'object',
                                    isParentTuple: false,
                                }}
                            />
                        </React.Fragment>
                    ))}
                    <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.icon}>
                            <AddThings
                                info={{
                                    id: collection.collection_id,
                                    name: '',
                                    type: 'object',
                                }}
                                collection={collection}
                                thing={things[collection.collection_id]}
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