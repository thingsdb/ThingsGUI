import React from 'react';
import PropTypes from 'prop-types';

import {ProcedureActions} from '../../Stores';
import {ChipsCard} from '../Util';

const tag = '14';

const Procedures = ({scope, onSetAsInput}) => {
    const [procedures, setProcedures] = React.useState([]);

    const handleProcedures = (p) => {
        setProcedures(p);
    };

    React.useLayoutEffect(() => {
        if (scope&&!scope.includes('@node')) {
            ProcedureActions.getProcedures(scope, tag, handleProcedures);
        }
    }, [scope]);

    const handleClickProcedure = (index) => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )})`;
        onSetAsInput(i);
    };

    const handleClickDeleteProcedure = (index) => {
        ProcedureActions.deleteProcedure(scope, procedures[index].name, tag, handleProcedures);
    };

    const handleClickAddProcedure = () => {
        onSetAsInput('new_procedure("...", ...)');
    };

    const p = scope&&!scope.includes('@node') ? procedures:[];

    return (
        <ChipsCard
            title="procedures"
            items={p}
            onAdd={handleClickAddProcedure}
            onClick={handleClickProcedure}
            onDelete={handleClickDeleteProcedure}
            tag={tag}
        />
    );
};

Procedures.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetAsInput: PropTypes.func.isRequired,
};

export default Procedures;