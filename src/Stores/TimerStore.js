import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const TimerActions = Vlow.createActions([
    'deleteTimer',
    'getTimer',
    'getTimerArgs',
    'getTimers',
    'runTimer',
]);


class TimerStore extends BaseStore {

    static types = {
        timer: PropTypes.object,
        timers: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
    }

    static defaults = {
        timer: {},
        timers: {},
    }

    constructor() {
        super(TimerActions);
        this.state = TimerStore.defaults;
    }

    onGetTimer(scope, timer, tag=null, cb=()=>null) {
        const query = `timer_info(${timer})`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                timer: data
            });
            cb(data);
        }).fail((event, status, message) => {
            tag===null?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
            return [];
        });
    }

    onGetTimers(scope, tag,  cb=()=>null) {
        const query = 'timers_info()';
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const timers = Object.assign({}, prevState.timers, {[scope]: data});
                return {timers};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteTimer(scope, timer, tag,  cb=()=>null) {
        const query = `del_timer(${timer}); timers_info();`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const timers = Object.assign({}, prevState.timers, {[scope]: data});
                return {timers};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onRunTimer(scope, timer, tag,  cb=()=>null) {
        const query = timer.with_side_effects ? `wse(run(${timer.id}));` : `run(${timer.id});` ;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onGetTimerArgs(scope, timer, tag, cb=()=>null) {
        const query = `timer_args(${timer});`;
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

export {TimerActions, TimerStore};
