import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { EditProvider, TitlePage } from '../../Utils';
import { Edit, Run } from '../Actions';


const Page = ({item, itemKey, scope, type}) => (
    <TitlePage
        preTitle={`Customizing ThingDB ${type}:`}
        title={item[itemKey] || ''}
        content={
            <Grid container spacing={1} size={12}>
                <Edit item={item} scope={scope} type={type} />
                {type === 'procedure' && (
                    <EditProvider>
                        <Run item={item} type={type} />
                    </EditProvider>
                )}
            </Grid>
        }
    />
);

Page.propTypes = {
    item: PropTypes.object.isRequired,
    itemKey: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Page;