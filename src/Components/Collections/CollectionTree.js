import React from 'react';
import PropTypes from 'prop-types';

import Things from '../Collection/Things';
import {ErrorMsg, HarmonicCard} from '../Util';


const CollectionTree = ({collection}) => {
    const [serverError, setServerError] = React.useState('');


    const handleServerError = (err) => {
        setServerError(err.log);
    };
    const handleCloseError = () => {
        setServerError('');
    };

    return (
        <HarmonicCard
            title="THINGS TREE"
            content={
                <React.Fragment>
                    <ErrorMsg error={serverError} onClose={handleCloseError} />
                    <Things collection={collection} onError={handleServerError} />
                </React.Fragment>
            }
        />
    );
};

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;