import { useLocation } from 'react-router-dom';
import { withVlow } from 'vlow';
import React from 'react';

import { getNameFromPath, isObjectEmpty } from '../Utils';
import { Page } from './Utils';
import { TASK_ROUTE } from '../../Constants/Routes';
import { TaskActions, TaskStore } from '../../Stores';
import { THINGSDB_SCOPE } from '../../Constants/Scopes';

const withStores = withVlow([{
    store: TaskStore,
    keys: ['tasks']
}]);


const scope = THINGSDB_SCOPE;
const itemKey = 'id';

const Task = ({tasks}) => {
    let location = useLocation();

    const taskId = getNameFromPath(location.pathname, TASK_ROUTE);
    const selectedTask = (tasks[scope] || []).find(c => String(c[itemKey]) === taskId);

    React.useEffect(() => {
        TaskActions.getLightTasks(scope);
    }, []);

    return (
        isObjectEmpty(selectedTask) ? null : (
            <Page item={selectedTask} scope={scope} type="task" itemKey={itemKey} />
        )
    );
};

Task.propTypes = {
    /* tasks properties */
    tasks: TaskStore.types.tasks.isRequired,
};

export default withStores(Task);