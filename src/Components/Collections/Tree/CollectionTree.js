import React from 'react';
import PropTypes from 'prop-types';


import {EditProvider} from '../CollectionsUtils';
import Things from './TreeView';
import {HarmonicCard} from '../../Util';


const CollectionTree = ({collection}) => (
    <HarmonicCard
        expand={false}
        title="THINGS TREE"
        content={
            <EditProvider>
                <Things collection={collection} />
            </EditProvider>
        }
    />
);

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;