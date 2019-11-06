import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const TypeActions = Vlow.createActions([
    'getType',
    'getTypes',
    'deleteType',
]);

// TODO: CALLBACKS
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

    onGetType(thing, scope, tag, cb) {
        const query = `type(${thing})`;
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

    onGetTypes(scope, tag) {
        const query = 'types_info()';
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                customTypes: data
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteType(scope, name, tag) {
        const query = `del_type('${name}'); types_info();`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                customTypes: data
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {TypeActions, TypeStore};
