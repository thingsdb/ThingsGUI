import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import CollectionInfo from './CollectionInfo';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import {HarmonicCard} from '../../Util';


const CollectionConfig = ({collection}) => {

    const buttons = [
        // {
        //     name: 'quotas',
        //     component: <SetQuotas collection={collection} />
        // },
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
            expand={false}
            title="INFO"
            content={<CollectionInfo collection={collection} />}
            buttons={
                <Grid container spacing={1} >
                    {buttons.map(button => (
                        <Grid key={button.name} item >
                            {button.component}
                        </Grid>
                    ))}
                </Grid>
            }
        />
    );
};

CollectionConfig.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionConfig;