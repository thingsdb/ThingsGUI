import PropTypes from 'prop-types';
import Vlow from 'vlow';
import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';

const TaskActions = Vlow.createActions([
    'deleteTask',
    'getTask',
    'getTaskArgs',
    'getTasks',
    'runTask',
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

    onGetTask(scope, task, tag=null, cb=()=>null) {
        const query = `task_info(${task})`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                task: data
            });
            cb(data);
        }).fail((event, status, message) => {
            tag===null?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
            return [];
        });
    }

    onGetTasks(scope, tag,  cb=()=>null) {
        const query = 'tasks_info()';
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

    onDeleteTask(scope, task, tag,  cb=()=>null) {
        const query = `del_task(${task}); tasks_info();`;
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

    onRunTask(scope, task, tag,  cb=()=>null) {
        const query = task.with_side_effects ? `wse(run(${task.id}));` : `run(${task.id});` ;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetTaskArgs(scope, task, tag, cb=()=>null) {
        const query = `task_args(${task});`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {TaskActions, TaskStore};
