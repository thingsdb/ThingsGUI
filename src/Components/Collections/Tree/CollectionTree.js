import React from 'react';
import PropTypes from 'prop-types';

import Things from './TreeView';
import {HarmonicCard} from '../../Util';


const CollectionTree = ({collection}) => (
    <HarmonicCard
        expand={false}
        title="THINGS TREE"
        content={
            <Things collection={collection} />
        }
    />
);

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;