import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import PropTypes from 'prop-types';
import Vlow from 'vlow';

const TaskActions = Vlow.createActions([
    'cancelTask',
    'deleteTask',
    'getArgs',
    'getLightTasks',
    'getOwner',
    'getTask',
]);

const queryGetLightTasks = 'tasks = tasks(); return(tasks.map(|t| {id: t.id(), at: t.at(), err: t.err()}), 2);';

class TaskStore extends BaseStore {

    static types = {
        tasks: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
    }

    static defaults = {
        tasks: {},
    }

    constructor() {
        super(TaskActions);
        this.state = TaskStore.defaults;
    }

    onGetLightTasks(scope, tag,  cb=()=>null) {
        this.emit('query', {
            query: queryGetLightTasks,
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

    onGetTask(scope, taskId, tag,  cb=()=>null) {
        this.emit('query', {
            query: `t = task(${taskId}); [t.id(), t.at(), t.owner(), t.closure(), t.err(), t.args()];`,
            scope
        }).done((data) => {
            const [id, at, owner, closure, err, args] = data;
            cb({id, at, owner, closure, err, args});
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteTask(scope, taskId, tag,  cb=()=>null) {
        const query = `task(${taskId}).del(); ${queryGetLightTasks}`;
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
        const query = `task(${taskId}).cancel(); ${queryGetLightTasks}`;
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
