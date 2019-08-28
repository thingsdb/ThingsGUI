import React from 'react';
import PropTypes from 'prop-types';

import Query from '../Collection/Query';
import {HarmonicCard} from '../Util';


const CollectionQuery = ({collection}) => {
    return (
        <HarmonicCard
            title="QUERY EDITOR"
            content={
                <Query collection={collection} />
            }
        />
    );
};

CollectionQuery.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionQuery;