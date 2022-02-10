import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import {
    GET_TASK_QUERY,
    LIGHT_TASKS_QUERY,
    TASK_ARGS_QUERY,
    TASK_CANCEL_QUERY,
    TASK_DEL_QUERY,
    TASK_OWNER_QUERY,
} from '../TiQueries';

const TaskActions = Vlow.createActions([
    'cancelTask',
    'deleteTask',
    'getArgs',
    'getLightTasks',
    'getOwner',
    'getTask',
]);

class TaskStore extends BaseStore {

    static types = {
        task: PropTypes.object,
        tasks: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
    }

    static defaults = {
        task: {},
        tasks: {},
    }

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
        this.emit('query', {
            query: GET_TASK_QUERY(taskId),
            scope
        }).done((data) => {
            const [id, at, owner, closure, err, args] = data;
            this.setState({task: {id, at, owner, closure, err, args}});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteTask(scope, taskId, tag,  cb=()=>null) {
        const query = TASK_DEL_QUERY(taskId) + ' ' + LIGHT_TASKS_QUERY;
        this.emit('query', {
            query,
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

    onCancelTask(scope, taskId, tag,  cb=()=>null) {
        const query =  TASK_CANCEL_QUERY(taskId) + ' ' + LIGHT_TASKS_QUERY;
        this.emit('query', {
            query,
            scope
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
        const query = TASK_ARGS_QUERY(taskId);
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetOwner(scope, taskId, tag,  cb=()=>null) {
        const query = TASK_OWNER_QUERY(taskId);
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }
}

export {TaskActions, TaskStore};
