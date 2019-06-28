import PropTypes from 'prop-types';
import React from 'react';
// import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import ViewCollection from './View';
// import Things from './Things';


const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

const Collection = ({collection}) => {
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
};

Collection.propTypes = {
    // classes: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStyles(styles)(Collection);