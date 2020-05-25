import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const EnumActions = Vlow.createActions([
    'getEnum',
    'getEnums',
    'deleteEnum',
]);


class EnumStore extends BaseStore {

    static types = {
        enums: PropTypes.object,
    }

    static defaults = {
        enums: {},
    }

    constructor() {
        super(EnumActions);
        this.state = EnumStore.defaults;
    }

    onGetEnum(q, scope, tag, cb) {
        const query = `${q}`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log);
            return [];
        });
    }

    onGetEnums(scope, tag, cb=()=>null) {
        const query = 'enums_info()';
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const enums = Object.assign({}, prevState.enums, {[scope]: data});
                return {enums};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteEnum(scope, name, tag, cb=()=>null) {
        const query = `del_enum('${name}'); enums_info();`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const enums = Object.assign({}, prevState.enums, {[scope]: data});
                return {enums};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {EnumActions, EnumStore};
