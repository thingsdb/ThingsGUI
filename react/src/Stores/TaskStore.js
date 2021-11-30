import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

const TaskActions = Vlow.createActions([
    'cancelTask',
    'deleteTask',
    'getArgs',
    'getOwner',
    'getTasks',
]);

const queryGetTasks = 'tasks = tasks(); return(tasks.map(|t| {id: t.id(), at: t.at(), owner: t.owner(), closure: t.closure(), err: t.err(), args: t.args()}), 2);';

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

    onGetTasks(scope, tag,  cb=()=>null) {
        this.emit('query', {
            query: queryGetTasks,
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

    onDeleteTask(scope, taskId, tag,  cb=()=>null) {
        const query = `task(${taskId}).del(); ${queryGetTasks}`;
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
        const query = `task(${taskId}).cancel(); ${queryGetTasks}`;
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
        const query = `task(${taskId}).args();`;
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
        const query = `task(${taskId}).owner();`;
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
