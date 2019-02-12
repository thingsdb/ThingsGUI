import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionActions} from '../../Stores/CollectionStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class ViewCollection extends React.Component {
    
    handleClickView = () => {
        const {collection} = this.props;
        ApplicationActions.navigate({path: 'things', collection});
        CollectionActions.query(collection);
    }

    render() {
        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.handleClickView}>
                    {'View'}
                </Button>
            </React.Fragment>
        );
    }
}

ViewCollection.propTypes = {
    // classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    collection: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(ViewCollection));