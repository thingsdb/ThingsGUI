import PropTypes from 'prop-types';
import React from 'react';
// import Typography from '@material-ui/core/Typography';

import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import ViewCollection from './View';
// import Things from './Things';


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
    collection: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default Collection;