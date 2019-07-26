/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';

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
    
    return (
        <React.Fragment>
            <List
                component="nav"
                className={classes.root}
            >
                {Object.entries(things[collection.collection_id]).map(([k, v]) => k === '#' ? null : (
                    <Thing key={k} thing={v} name={k} collection={collection} />
                ))}
            </List>
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