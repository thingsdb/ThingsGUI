import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { Card } from'./Utils';
import { HarmonicCardHeader, nextRunFn, LocalErrorMsg } from '../Utils';
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
    {ky: 'err', label: 'Error', fn: (e: string) => !e ? '-' : e === 'success' ? e : <LocalErrorMsg msg={e} useAsPopUp />},
];

const tag = TasksTAG;

const Tasks = ({
    buttonsView,
    dialogsView,
    onCallback = () => null,
    tasks,
    scope,
}: ITaskStore & Props) => {
    const [identifier, setIdentifier] = React.useState(null);
    const [open, setOpen] = React.useState({
        add: false,
        cancel: false,
        edit: false,
        view: false,
    });

    const handleRefreshTasks = React.useCallback(() => {
        TaskActions.getLightTasks(scope, TasksTAG);
    }, [scope]);

    React.useEffect(() => {
        handleRefreshTasks();
    }, [handleRefreshTasks]);

    const handleClick = (type: string, ident: string) => () => {
        // TODOT use ident arg in onCallback
        setIdentifier(ident);
        setOpen({...open, [type]: true});
        onCallback(type, (tasks[scope] || []).find(i=>i.id == identifier));
    };

    const handleClickAdd = () => {
        setIdentifier(null);
        setOpen({...open, add: true});
        onCallback('add', null);
    };

    const handleClickDelete = (id: number, cb: () => void, tag: string) => {
        TaskActions.deleteTask(
            scope,
            id,
            tag,
            () => cb()
        );
    };

    const handleClose = (c: object) => {
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

Tasks.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    dialogsView: PropTypes.object.isRequired,
    onCallback: PropTypes.func,
    scope: PropTypes.string.isRequired,

    /* tasks properties */
    tasks: TaskStore.types.tasks.isRequired,
};

export default withStores(Tasks);


interface Props {
    buttonsView: object;
    dialogsView: object;
    onCallback: (type: string, task: object) => void;
    scope: string;
}
