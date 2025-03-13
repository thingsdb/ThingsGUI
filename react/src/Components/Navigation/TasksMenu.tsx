import { withVlow } from 'vlow';
import TaskIcon from '@mui/icons-material/Task';
import React from 'react';

import { AddTaskDialog } from '../ProceduresAndTasks';
import { Menu, orderByName } from '../Utils';
import { TASK_ROUTE } from '../../Constants/Routes';
import { TaskActions, TaskStore } from '../../Stores';
import { THINGSDB_SCOPE } from '../../Constants/Scopes';

const withStores = withVlow([{
    store: TaskStore,
    keys: ['tasks']
}]);


const scope = THINGSDB_SCOPE;
const TasksMenu = ({tasks}: ITaskStore) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        TaskActions.getLightTasks(scope);
    }, []);

    const handleRefresh = () => {
        TaskActions.getLightTasks(scope);
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const orderedTasks = orderByName(tasks[scope]||[], 'id');

    return (
        <React.Fragment>
            <Menu
                homeRoute={TASK_ROUTE}
                icon={<TaskIcon color="primary" />}
                itemKey="id"
                items={orderedTasks}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                title="tasks"
            />
            <AddTaskDialog open={open} onClose={handleClose} scope={scope} />
        </React.Fragment>
    );
};

TasksMenu.propTypes = {

    /* tasks properties */
    tasks: TaskStore.types.tasks.isRequired,
};

export default withStores(TasksMenu);