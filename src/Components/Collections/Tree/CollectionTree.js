import React from 'react';
import PropTypes from 'prop-types';


import {EditProvider} from './TreeActions/Context';
import Things from './TreeView';
import {HarmonicCard} from '../../Util';


const CollectionTree = ({collection}) => (
    <HarmonicCard
        expand={false}
        title="THINGS TREE"
        content={
            <React.Fragment>
                <EditProvider>
                    <Things collection={collection} />
                </EditProvider>
            </React.Fragment>
        }
    />
);

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;