import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {findItem, isObjectEmpty, TitlePage} from '../Util';
import {Edit, Remove, Run, View} from './Actions';
import {EditProvider} from '../Collections/CollectionsUtils';


const Page = ({match, list, scope, type}) => {

    const selectedItem = findItem(match.index, list[scope]||[]);

    const buttons = [
        {
            name: 'view',
            component: <View item={selectedItem} type={type} />
        },
        {
            name: 'edit',
            component: <Edit item={selectedItem} scope={scope} type={type} />
        },
        {
            name: 'remove',
            component: <Remove item={selectedItem} scope={scope} close={(list[scope].length-1) != match.index} type={type} />
        },
    ];

    return (
        isObjectEmpty(selectedItem) ? null
            : (
                <TitlePage
                    preTitle={`Customizing ThingDB ${type}:`}
                    title={selectedItem.name || ''}
                    content={
                        <React.Fragment>
                            <Grid container spacing={1} item md={9} sm={12}>
                                <EditProvider>
                                    <Run item={selectedItem} type={type} />
                                </EditProvider>
                            </Grid>
                            <Grid container item md={3} sm={12} spacing={1} justify="center" alignItems="center" >
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
    match: PropTypes.object.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Page;