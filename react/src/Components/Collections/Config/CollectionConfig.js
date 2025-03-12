import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { HarmonicCardContent } from '../../Utils';
import CollectionInfo from './CollectionInfo';
import ExportCollection from './Export';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';

const CollectionConfig = ({collection}) => {

    const buttons = [
        {
            name: 'rename',
            component: <RenameCollection collection={collection} />
        },
        {
            name: 'remove',
            component: <RemoveCollection collection={collection} />
        },
        {
            name: 'export',
            component: <ExportCollection collection={collection} />
        },
    ];

    return (
        <HarmonicCardContent
            content={<CollectionInfo collection={collection} />}
            buttons={
                <Grid container spacing={1}>
                    {buttons.map(button => (
                        <Grid key={button.name}>
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