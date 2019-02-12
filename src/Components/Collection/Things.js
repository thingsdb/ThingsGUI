import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Thing from './Thing';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionStore} from '../../Stores/CollectionStore';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match'],
}, {
    store: CollectionStore,
    keys: ['collection'],
}]);

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Things extends React.Component {

    renderThing = ([k, v]) => {
        return (
            <div key={k}>
                <Thing thing={v} name={k} />
            </div>
        );
    }

    render() {
        const {classes, collection} = this.props;
        
        return (
            <React.Fragment>
                <List
                    component="nav"
                    className={classes.root}
                >
                    {Object.entries(collection).map(this.renderThing)}
                </List>
            </React.Fragment>
        );
    }
}

Things.propTypes = {
    classes: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    collection: CollectionStore.types.collection.isRequired,
};

export default withStores(withStyles(styles)(Things));