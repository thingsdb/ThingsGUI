import React from 'react';
import PropTypes from 'prop-types';

import CollectionInfo from './CollectionInfo';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import {HarmonicCard} from '../Util';


const CollectionConfig = ({collection}) => {

    const buttons = [
        {
            name: 'quotas',
            component: <SetQuotas collection={collection} />
        },
        {
            name: 'rename',
            component: <RenameCollection collection={collection} />
        },
        {
            name: 'remove',
            component: <RemoveCollection collection={collection} />
        },
    ];

    return (
        <HarmonicCard
            title="INFO"
            content={<CollectionInfo collection={collection} />}
            buttons={
                <React.Fragment>
                    {buttons.map(button => (
                        <React.Fragment key={button.name}>
                            {button.component}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            }
        />
    );
};

CollectionConfig.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionConfig;