/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import RenameProperty from './RenameProperty';
import RemoveObject from './RemoveObject';
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
});

const ThingRoot = ({classes, things, collection}) => {

    const [serverError, setServerError] = React.useState('');
    const fetched = things.hasOwnProperty(collection.collection_id);
    
    React.useEffect(() => {
        CollectionActions.query(collection, (err) => setServerError(err.log));
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
                        <Thing key={k} thing={v} name={k} collection={collection} onServerError={handleServerError} />
                    ))}
                </List>
            ) : (
                <Typography variant={'caption'}>
                    {'This collections does not have anything stored yet.'}
                </Typography>
            )}
            <Grid item container xs={12} spacing={1} >
                <Grid item>
                    <RenameProperty collection={collection} things={things} />
                </Grid>
                <Grid item>
                    <RemoveObject collection={collection} things={things} />
                </Grid>
            </Grid>
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