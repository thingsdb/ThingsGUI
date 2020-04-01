import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const TypeActions = Vlow.createActions([
    'getType',
    'getTypes',
    'deleteType',
]);


class TypeStore extends BaseStore {

    static types = {
        customTypes: PropTypes.object,
    }

    static defaults = {
        customTypes: {},
    }

    constructor() {
        super(TypeActions);
        this.state = TypeStore.defaults;
    }

    onGetType(q, scope, tag, cb) {
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

    onGetTypes(scope, tag, cb=()=>null) {
        const query = 'types_info()';
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const customTypes = Object.assign({}, prevState.customTypes, {[scope]: data});
                return {customTypes};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteType(scope, name, tag, cb=()=>null) {
        const query = `del_type('${name}'); types_info();`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const customTypes = Object.assign({}, prevState.customTypes, {[scope]: data});
                return {customTypes};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {TypeActions, TypeStore};
