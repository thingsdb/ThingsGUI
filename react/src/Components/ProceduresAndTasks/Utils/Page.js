import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import React from 'react';

import { EditProvider, TitlePage } from '../../Utils';
import { Cancel, Edit, Remove, Run } from '../Actions';


const Page = ({item, itemKey, scope, type}) => {

    const buttons = {
        task: <Cancel item={item} scope={scope} />
    };

    return (
        <TitlePage
            preTitle={`Customizing ThingDB ${type}:`}
            title={item[itemKey] || ''}
            content={
                <React.Fragment>
                    <Grid container spacing={1} item md={8} sm={12}>
                        <Edit item={item} scope={scope} type={type} />
                        {type === 'procedure' && (
                            <EditProvider>
                                <Run item={item} type={type} />
                            </EditProvider>
                        )}
                    </Grid>
                    <Grid container item md={4} sm={12} spacing={1} justifyContent="center" alignItems="center" >
                        <Grid item>
                            {buttons[type]}
                        </Grid>
                        <Grid item>
                            <Remove item={item} scope={scope} type={type} />
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        />
    );
};

Page.propTypes = {
    item: PropTypes.object.isRequired,
    itemKey: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Page;