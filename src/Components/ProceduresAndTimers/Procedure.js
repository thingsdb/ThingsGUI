import {withVlow} from 'vlow';
import React from 'react';

import {ApplicationStore, ProcedureActions, ProcedureStore} from '../../Stores';
import Page from './Page';

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

    return (
        <Page match={match} list={procedures} scope={scope} type="procedure" />
    );
};

Procedure.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedure);