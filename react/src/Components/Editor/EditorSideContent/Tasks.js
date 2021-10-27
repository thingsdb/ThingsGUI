import PropTypes from 'prop-types';
import React from 'react';

import { Tasks } from '../../ProceduresAndTasks';


const TasksEditor = ({onSetQueryInput, scope}) => {

    const handleCallback = (type, task) => {
        switch(type){
        case 'add':
            onSetQueryInput('new_task(');
            break;
        case 'run':
            if(task){
                const run = `run(${task.id})`;
                const input = task.with_side_effects ? `wse(${run})` : run;
                onSetQueryInput(input);
            }
            break;
        }
    };

    return (
        <Tasks
            buttonsView={{add: true, edit: false, run: true, view: true}}
            dialogsView={{add: false, edit: false, run: false, view: true}}
            onCallback={handleCallback}
            scope={scope}
        />

    );
};

TasksEditor.propTypes = {
    onSetQueryInput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default TasksEditor;
