import PropTypes from 'prop-types';
import React from 'react';

import { Tasks } from '../../ProceduresAndTasks';
import { NEW_TASK_EMPTY_QUERY, TASK_FORMAT_QUERY } from '../../../TiQueries/Queries';


const TasksEditor = ({onSetQueryInput, scope}: Props) => {

    const handleCallback = (type: 'add' | 'run', task: ITask) => {
        switch(type){
        case 'add':
            onSetQueryInput(NEW_TASK_EMPTY_QUERY('<start>, <closure>, <args>)'));
            break;
        case 'run':
            if(task){
                const input = TASK_FORMAT_QUERY(task.id);
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

interface Props {
    onSetQueryInput: (d: string) => void;
    scope: string;
}