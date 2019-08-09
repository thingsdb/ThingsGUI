/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import AddThings from './AddThings';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import ServerError from '../Util/ServerError';

import Thing from './Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);


const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    thing: {
        paddingLeft: theme.spacing(6),
    },
});

const ThingRoot = ({classes, things, collection}) => {

    const [serverError, setServerError] = React.useState('');
    const fetched = things.hasOwnProperty(collection.collection_id);
    
    React.useEffect(() => {
        CollectionActions.query(collection.collection_id, (err) => setServerError(err.log));
    }, [collection.collection_id]);
    
    const handleCloseError = () => {
        setServerError('');
    }

    const handleServerError = (err) => {
        setServerError(err);
    }

    const openError = Boolean(serverError);

    return (
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            {fetched ? (
                <List
                    component="nav"
                    className={classes.root}
                    dense
                >
                    {Object.entries(things[collection.collection_id]).map(([k, v]) => k === '#' ? null : (
                        <Thing className={classes.thing} key={k} thing={v} name={k} collection={collection} onServerError={handleServerError} />
                    ))}
                    <ListItem>
                        <ListItemIcon>
                            <AddThings collection={collection} thing={things[collection.collection_id]} />
                        </ListItemIcon>
                    </ListItem>
                </List>
            ) : (
                <Typography variant={'caption'}>
                    {'This collections does not have anything stored yet.'}
                </Typography>
            )}
        </React.Fragment>
    );
};

ThingRoot.propTypes = {
    collection: PropTypes.object.isRequired, 

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};


export default withStyles(styles)(withStores(ThingRoot));