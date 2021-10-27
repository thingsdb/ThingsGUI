import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { Card } from'./Utils';
import { HarmonicCardHeader } from '../Utils';
import { nextRunFn } from '../Utils';
import { TaskActions, TaskStore } from '../../Stores';
import { TaskDialogs } from '.';
import { TasksTAG } from '../../Constants/Tags';


const withStores = withVlow([{
    store: TaskStore,
    keys: ['tasks']
}]);

const header = [
    {ky: 'id', label: 'ID'},
    {ky: 'at', label: 'At', fn: nextRunFn},
    {ky: 'owner', label: 'Owner'},
    {ky: 'err', label: 'Error', fn: (e) => e || '-'},
];

const tag = TasksTAG;

const Tasks = ({buttonsView, dialogsView, onCallback, tasks, scope}) => {
    const [identifier, setIdentifier] = React.useState(null);
    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        view: false,
    });

    const handleRefreshTasks = React.useCallback(() => {
        TaskActions.getTasks(scope, TasksTAG);
    }, [scope]);

    React.useEffect(() => {
        handleRefreshTasks();
    }, [handleRefreshTasks]);

    const handleClick = (type, ident) => () => {
        setIdentifier(ident);
        setOpen({...open, [type]: true});
        onCallback(type, (tasks[scope] || []).find(i=>i.id == identifier));
    };

    const handleClickAdd = () => {
        setIdentifier(null);
        setOpen({...open, add: true});
        onCallback('add', null);
    };

    const handleClickDelete = (id, cb, tag) => {
        TaskActions.deleteTask(
            scope,
            id,
            tag,
            ()=> cb()
        );
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    return (
        <HarmonicCardHeader title="TASKS" onRefresh={handleRefreshTasks} unmountOnExit>
            <Card
                buttonsView={buttonsView}
                header={header}
                itemKey={'id'}
                onDelete={handleClickDelete}
                onAdd={handleClickAdd}
                onClick={handleClick}
                list={tasks[scope] || []}
                tag={tag}
            />
            <TaskDialogs dialogsView={dialogsView} id={identifier} open={open} onClose={handleClose} tasks={tasks[scope]||[]} scope={scope} />
        </HarmonicCardHeader>
    );
};

Tasks.defaultProps = {
    onCallback: () => null,
};

Tasks.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    dialogsView: PropTypes.object.isRequired,
    onCallback: PropTypes.func,
    scope: PropTypes.string.isRequired,

    /* tasks properties */
    tasks: TaskStore.types.tasks.isRequired,
};

export default withStores(Tasks);
