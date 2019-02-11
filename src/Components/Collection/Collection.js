import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Thing from './Thing';
import {CollectionStore} from '../../Stores/CollectionStore';

const withStores = withVlow({
    store: CollectionStore,
    keys: ['collection', 'collectionName'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Collection extends React.Component {
    renderThing = ([k, v]) => {
        return (
            <div key={k}>
                <Thing thing={v} name={k} />
            </div>
        );
    }

    render() {
        const {classes, collection, collectionName} = this.props;

        return (
            <List
                component="nav"
                subheader={
                    <ListSubheader component="div">
                        {'Collection - ' + collectionName}
                    </ListSubheader>
                }
                className={classes.root}
            >
                {Object.entries(collection).map(this.renderThing)}
            </List>
        );
    }
}

Collection.propTypes = {
    classes: PropTypes.object.isRequired,
    collection: CollectionStore.types.collection.isRequired,
    collectionName: CollectionStore.types.collectionName.isRequired,
};

export default withStores(withStyles(styles)(Collection));