import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import React from 'react';

import { EditProvider, TitlePage } from '../../Utils';
import { Edit, Remove, Run, View } from '../Actions';


const Page = ({item, itemKey, scope, type}) => {

    const buttons = [
        {
            name: 'view',
            component: <View item={item} scope={scope} type={type} />
        },
        {
            name: 'edit',
            component: <Edit item={item} scope={scope} type={type} />
        },
        {
            name: 'remove',
            component: <Remove item={item} scope={scope} type={type} />
        },
    ];

    return (
        <TitlePage
            preTitle={`Customizing ThingDB ${type}:`}
            title={item[itemKey] || ''}
            content={
                <React.Fragment>
                    <Grid container spacing={1} item md={8} sm={12}>
                        <EditProvider>
                            <Run item={item} type={type} />
                        </EditProvider>
                    </Grid>
                    <Grid container item md={4} sm={12} spacing={1} justifyContent="center" alignItems="center" >
                        {buttons.map(button => (
                            <Grid key={button.name} item>
                                {button.component}
                            </Grid>
                        ))}
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