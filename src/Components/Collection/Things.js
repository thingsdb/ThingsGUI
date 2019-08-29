/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import AddThings from './AddThings';
import CollectionActions from '../../Actions/CollectionActions';

import Thing from './Thing';

const collectionActions = new CollectionActions();


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    thing: {
        paddingLeft: theme.spacing(6),
    },
}));

const ThingRoot = ({collection}) => {
    const classes = useStyles();
    const fetched = things.hasOwnProperty(collection.collection_id);
    const things = useGlobal('things')[0];

    React.useEffect(() => {
        collectionActions.query(collection.collection_id);
    }, [collection.collection_id]);

    return (
        <React.Fragment>
            {fetched ? (
                <List
                    component="nav"
                    className={classes.root}
                    dense
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
                                    parentType: 'object',
                                }}
                            />
                        </React.Fragment>
                    ))}
                    <ListItem>
                        <ListItemIcon>
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
};


export default ThingRoot;