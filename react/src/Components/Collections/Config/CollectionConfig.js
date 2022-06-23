import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { HarmonicCardContent } from '../../Utils';
import { TypeEnumNetwork } from '../EnumsTypes/Utils';
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
        {
            name: 'network',
            component: <TypeEnumNetwork collection={collection} />
        },
    ];

    return (
        <HarmonicCardContent
            content={<CollectionInfo collection={collection} />}
            buttons={
                <Grid container spacing={1}>
                    {buttons.map(button => (
                        <Grid key={button.name} item>
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