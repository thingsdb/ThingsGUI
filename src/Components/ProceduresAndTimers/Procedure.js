import {withVlow} from 'vlow';
import React from 'react';

import {ApplicationStore, ProcedureActions, ProcedureStore} from '../../Stores';
import {Page} from './Utils';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ProcedureStore,
    keys: ['procedures']
}]);


const scope = THINGSDB_SCOPE;
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