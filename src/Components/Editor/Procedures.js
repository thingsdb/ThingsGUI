import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import {ProcedureActions, ProcedureStore} from '../../Stores/ProcedureStore';
import {Chips} from '../Util';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);


const tag = '8';

const Procedures = ({scope, onSetAsInput, procedures}) => {
    React.useEffect(() => {
        if (scope&&!scope.includes('@node')) {
            ProcedureActions.getProcedures(scope, tag);
        }
    }, [scope]);

    const handleClickProcedure = (index) => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )})`;
        onSetAsInput(i);
    };

    const handleClickDeleteProcedure = (index) => {
        ProcedureActions.deleteProcedure(scope, procedures[index].name, tag);
    };

    const handleClickAddProcedure = () => {
        onSetAsInput('new_procedure("...", ...)');
    };

    const p = scope&&!scope.includes('@node') ? procedures:[];

    return (
        <Chips
            title="procedures"
            items={p}
            onAdd={handleClickAddProcedure}
            onClick={handleClickProcedure}
            onDelete={handleClickDeleteProcedure}
        />
    );
};

Procedures.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetAsInput: PropTypes.func.isRequired,

    // procedures store
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedures);