import PropTypes from 'prop-types';
import React from 'react';

import { Tasks } from '../../ProceduresAndTasks';
import { NEW_TASK_EMPTY_QUERY, TASK_QUERY } from '../../../TiQueries';


const TasksEditor = ({onSetQueryInput, scope}) => {

    const handleCallback = (type, task) => {
        switch(type){
        case 'add':
            onSetQueryInput(NEW_TASK_EMPTY_QUERY('<start>, <closure>, <args>)'));
            break;
        case 'run':
            if(task){
                const input = TASK_QUERY(task.id);
                onSetQueryInput(input);
            }
            break;
        }
    };

    return (
        <Tasks
            buttonsView={{add: true, cancel: true, edit: false, run: true, view: true}}
            dialogsView={{add: false, cancel: true, edit: false, run: false, view: true}}
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
