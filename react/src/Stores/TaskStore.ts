//@ts-nocheck
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import { ID_ARGS } from '../TiQueries/Arguments';
import {
    GET_TASK_QUERY,
    LIGHT_TASKS_QUERY,
    TASK_ARGS_QUERY,
    TASK_CANCEL_QUERY,
    TASK_DEL_QUERY,
    TASK_OWNER_QUERY,
} from '../TiQueries/Queries';

const TaskActions = Vlow.factoryActions<TaskStore>()([
    'cancelTask',
    'deleteTask',
    'getArgs',
    'getLightTasks',
    'getOwner',
    'getTask',
] as const);

class TaskStore extends BaseStore {

    static types = {
        task: PropTypes.object,
        tasks: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
    };

    static defaults = {
        task: {},
        tasks: {},
    };

    constructor() {
        super(TaskActions);
        this.state = TaskStore.defaults;
    }

    onGetLightTasks(scope, tag,  cb=()=>null) {
        this.emit('query', {
            query: LIGHT_TASKS_QUERY,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const tasks = Object.assign({}, prevState.tasks, {[scope]: data});
                return {tasks};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onGetTask(scope, taskId, tag) {
        const query = GET_TASK_QUERY;
        const jsonArgs = ID_ARGS(taskId);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            const [id, at, owner, closure, err, args] = data;
            this.setState({task: {id, at, owner, closure, err, args}});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteTask(scope, taskId, tag,  cb=()=>null) {
        const query = TASK_DEL_QUERY + ' ' + LIGHT_TASKS_QUERY;
        const jsonArgs = ID_ARGS(taskId);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const tasks = Object.assign({}, prevState.tasks, {[scope]: data});
                return {tasks};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onCancelTask(scope, taskId, tag,  cb=()=>null) {
        const query =  TASK_CANCEL_QUERY + ' ' + LIGHT_TASKS_QUERY;
        const jsonArgs = ID_ARGS(taskId);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const tasks = Object.assign({}, prevState.tasks, {[scope]: data});
                return {tasks};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetArgs(scope, taskId, tag,  cb=()=>null) {
        const query = TASK_ARGS_QUERY;
        const jsonArgs = ID_ARGS(taskId);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetOwner(scope, taskId, tag,  cb=()=>null) {
        const query = TASK_OWNER_QUERY;
        const jsonArgs = ID_ARGS(taskId);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }
}

export {TaskActions, TaskStore};

declare global {
    interface ITask {
        id: number;
        at: string;
        err: string;
        owner: string;
        closure: string;
        args: string[]

        // TODOT narrow in ProceduresAndTasks
        name?: string;
        with_side_effects?: boolean;
        arguments?: any[];
    }
    interface ITaskLight {
        id: number;
        at: string;
        err: string;
    }
    interface ITaskStore {
        task: ITask;
        tasks: {
            [index: string]: ITask[];
        };
    }
}