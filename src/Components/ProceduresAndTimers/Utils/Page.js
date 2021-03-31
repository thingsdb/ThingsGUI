import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {findItem, isObjectEmpty, TitlePage} from '../../Util';
import {Edit, Remove, Run, View} from '../Actions';
import {EditProvider} from '../../Collections/CollectionsUtils';


const Page = ({itemKey, match, data, scope, type}) => {

    const selectedItem = findItem(match.index, data[scope]||[]);

    const buttons = [
        {
            name: 'view',
            component: <View item={selectedItem} scope={scope} type={type} />
        },
        {
            name: 'edit',
            component: <Edit item={selectedItem} scope={scope} type={type} />
        },
        {
            name: 'remove',
            component: <Remove item={selectedItem} scope={scope} close={(data[scope].length-1) != match.index} type={type} />
        },
    ];

    return (
        isObjectEmpty(selectedItem) ? null
            : (
                <TitlePage
                    preTitle={`Customizing ThingDB ${type}:`}
                    title={`${selectedItem[itemKey]}` || ''}
                    content={
                        <React.Fragment>
                            <Grid container spacing={1} item md={8} sm={12}>
                                <EditProvider>
                                    <Run item={selectedItem} type={type} />
                                </EditProvider>
                            </Grid>
                            <Grid container item md={4} sm={12} spacing={1} justify="center" alignItems="center" >
                                {buttons.map(button => (
                                    <Grid key={button.name} item>
                                        {button.component}
                                    </Grid>
                                ))}
                            </Grid>
                        </React.Fragment>
                    }
                />
            )
    );
};

Page.propTypes = {
    itemKey: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Page;