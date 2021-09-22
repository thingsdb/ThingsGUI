import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import {withVlow} from 'vlow';

import {ThingActions} from '../TreeActions';
import {CollectionStore, CollectionActions} from '../../../../Stores';
import {THING} from '../../../../Constants/ThingTypes';
import {COLLECTION_SCOPE} from '../../../../Constants/Scopes';
import ThingRestrict from './ThingRestrict';
import Thing from './Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
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

const ThingRoot = ({things, collection}) => {
    const classes = useStyles();
    const fetched = things.hasOwnProperty(collection.collection_id);

    React.useEffect(() => {
        CollectionActions.getThings(collection.collection_id, collection.name);
    }, [collection.collection_id, collection.name]);

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
                                type: THING,
                                isTuple: false,
                            }}
                            child={{
                                name: k,
                                index: null,
                            }}
                        />
                    )}
                />
                <Divider className={classes.divider} />
                <ListItem className={classes.listItem}>
                    <ListItemIcon className={classes.icon}>
                        <ThingActions
                            child={{
                                id: collection.collection_id,
                                index: null,
                                name: 'root',
                                type: THING,
                            }}
                            parent={{
                                id: null,
                                index: null,
                                name: '',
                                type: '',
                                isTuple: false,
                            }}
                            scope={`${COLLECTION_SCOPE}:${collection.name}`}
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

};


export default withStores(ThingRoot);