import {withVlow} from 'vlow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {findItem, isObjectEmpty, TitlePage} from '../Util';
import {ApplicationStore, ProcedureActions, ProcedureStore} from '../../Stores';
import Edit from './Edit';
import Remove from './Remove';
import Run from './Run';

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
            name: 'run',
            component: <Run procedure={selectedProcedure} scope={scope} />
        },
        {
            name: 'remove',
            component: <Remove procedure={selectedProcedure} scope={scope} />
        },
    ];

    return (
        isObjectEmpty(selectedProcedure) ? null
            : (
                <TitlePage
                    preTitle='Customizing ThingDB procedure:'
                    title={selectedProcedure.name}
                    content={
                        <Grid item md={12} xs={12}>
                            <Grid container >
                                <Grid item lg={8} md={12} xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Edit procedure={selectedProcedure} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid container item lg={4} md={12} spacing={1} direction="row" justify="center" alignItems="center" >
                                    {buttons.map(button => (
                                        <Grid key={button.name} item>
                                            {button.component}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
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