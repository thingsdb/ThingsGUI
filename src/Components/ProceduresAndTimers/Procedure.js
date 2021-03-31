import {withVlow} from 'vlow';
import React from 'react';

import {ApplicationStore, ProcedureActions, ProcedureStore} from '../../Stores';
import {Page} from './Utils';

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
        <Page match={match} data={procedures} scope={scope} type="procedure" itemKey="name" />
    );
};

Procedure.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedure);