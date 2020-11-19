import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import CollectionInfo from './CollectionInfo';
import ExportCollection from './Export';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import {HarmonicCardContent} from '../../Util';


const CollectionConfig = ({collection, close}) => {

    const buttons = [
        {
            name: 'rename',
            component: <RenameCollection collection={collection} />
        },
        {
            name: 'remove',
            component: <RemoveCollection collection={collection} close={close} />
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
                        <Grid key={button.name} item>
                            {button.component}
                        </Grid>
                    ))}
                </Grid>
            }
        />
    );
};

CollectionConfig.defaultProps = {
    close: false,
};

CollectionConfig.propTypes = {
    collection: PropTypes.object.isRequired,
    close: PropTypes.bool,
};

export default CollectionConfig;