import React from 'react';
import PropTypes from 'prop-types';

import Things from './TreeView';
import {HarmonicCard} from '../../Util';


const CollectionTree = ({collection}) => (
    <HarmonicCard
        title="THINGS TREE"
        content={
            <React.Fragment>
                <Things collection={collection} />
            </React.Fragment>
        }
    />
);

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;