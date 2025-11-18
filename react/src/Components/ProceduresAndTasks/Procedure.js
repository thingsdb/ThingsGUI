import {useLocation} from 'react-router';
import {withVlow} from 'vlow';
import React from 'react';

import {getNameFromPath, isObjectEmpty} from '../Utils';
import {Page} from './Utils';
import {PROCEDURE_ROUTE} from '../../Constants/Routes';
import {ProcedureActions, ProcedureStore} from '../../Stores';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);


const scope = THINGSDB_SCOPE;
const itemKey = 'name';

const Procedure = ({procedures}) => {
    let location = useLocation();
    const procedureName = getNameFromPath(location.pathname, PROCEDURE_ROUTE);
    const selectedProcedure = (procedures[scope] || []).find(c => c[itemKey] === procedureName);

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope);
    }, []);

    return (
        isObjectEmpty(selectedProcedure) ? null : (
            <Page item={selectedProcedure} itemKey={itemKey} scope={scope} type="procedure" />
        )
    );
};

Procedure.propTypes = {
    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedure);