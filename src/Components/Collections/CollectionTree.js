import React from 'react';
import PropTypes from 'prop-types';

import Things from '../Collection/Things';
import {ErrorMsg, HarmonicCard} from '../Util';


const CollectionTree = ({collection}) => {

    return (
        <HarmonicCard
            title="THINGS TREE"
            content={
                <React.Fragment>
                    {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
                    <Things collection={collection} />
                </React.Fragment>
            }
        />
    );
};

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;