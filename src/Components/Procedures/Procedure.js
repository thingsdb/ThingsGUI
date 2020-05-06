import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {findItem, isObjectEmpty, TitlePage} from '../Util';
import {ApplicationStore, ProcedureActions, ProcedureStore} from '../../Stores';
import {Edit, Remove, Run, View} from './Actions';
import {EditProvider} from '../Collections/CollectionsUtils';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ProcedureStore,
    keys: ['procedures']
}]);


const scope = '@thingsdb';
const Procedure = ({match, procedures}) => {

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope);
    }, []);

    const selectedProcedure = findItem(match.index, procedures[scope]||[]);

    const buttons = [
        {
            name: 'view',
            component: <View procedure={selectedProcedure} />
        },
        {
            name: 'edit',
            component: <Edit procedure={selectedProcedure} scope={scope} />
        },
        {
            name: 'remove',
            component: <Remove procedure={selectedProcedure} scope={scope} close={(procedures[scope].length-1)!=match.index} />
        },
    ];

    return (
        isObjectEmpty(selectedProcedure) ? null
            : (
                <TitlePage
                    preTitle='Customizing ThingDB procedure:'
                    title={selectedProcedure.name}
                    content={
                        <React.Fragment>
                            <Grid container spacing={1} item md={9} sm={12}>
                                <EditProvider>
                                    <Run procedure={selectedProcedure} />
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

Procedure.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedure);