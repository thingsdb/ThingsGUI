import PropTypes from 'prop-types';
import React from 'react';

import { Procedures } from '../../ProceduresAndTasks';

const ProceduresEditor = ({onSetQueryInput, scope}) => {

    const handleCallback = (type, procedure) => {
        switch(type){
        case 'add':
            onSetQueryInput('new_procedure(');
            break;
        case 'run':
            if(procedure){
                const run = `run('${procedure.name}',${procedure.arguments.map(a=>` <${a}>` )})`;
                const input = procedure.with_side_effects ? `wse(${run})` : run;
                onSetQueryInput(input);
            }
            break;
        }
    };

    return (
        <Procedures
            buttonsView={{add: true, cancel: false, edit: false, run: true, view: true}}
            dialogsView={{add: false, cancel: false, edit: false, run: false, view: true}}
            onCallback={handleCallback}
            scope={scope}
        />
    );
};

ProceduresEditor.propTypes = {
    onSetQueryInput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default ProceduresEditor;
