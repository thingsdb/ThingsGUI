import PropTypes from 'prop-types';
import React from 'react';
// import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import ViewCollection from './View';
// import Things from './Things';
import {ApplicationStore} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Collection extends React.Component {
    
    render() {
        const {collection} = this.props;
        
        return (
            <React.Fragment>
                {/* <Typography>
                    {collection.name}
                </Typography> */}
                <ViewCollection collection={collection} />
                <RenameCollection collection={collection} />
                <RemoveCollection collection={collection} />
                <SetQuotas collection={collection} />
            </React.Fragment>
        );
    }
}

Collection.propTypes = {
    // classes: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(Collection));