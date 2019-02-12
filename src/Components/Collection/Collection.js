// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Things from './Things';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
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
        backgroundColor: theme.palette.background.paper,
    },
});

class Collection extends React.Component {

    render() {
        const {match} = this.props;
        
        return (
            <React.Fragment>
                <Things />
                <RemoveCollection collection={match.collection} />
                <RenameCollection collection={match.collection} />
            </React.Fragment>
        );
    }
}

Collection.propTypes = {
    // classes: PropTypes.object.isRequired,
    match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(Collection));