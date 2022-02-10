import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import {
    DEL_TYPE_QUERY,
    RENAME_TYPE_QUERY,
    TYPES_INFO_QUERY,
} from '../TiQueries';

const TypeActions = Vlow.createActions([
    'getType',
    'getTypes',
    'deleteType',
    'renameType'
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
        this.emit('query', {
            q,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log);
            return [];
        });
    }

    onGetTypes(scope, tag, cb=()=>null) {
        const query = TYPES_INFO_QUERY;
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
        const query = DEL_TYPE_QUERY + ' ' + TYPES_INFO_QUERY;
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

    onRenameType(oldName, newName, scope, tag, cb=()=>null) {
        const query = RENAME_TYPE_QUERY + ' ' + TYPES_INFO_QUERY;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const customTypes = Object.assign({}, prevState.customTypes, {[scope]: data});
                return {customTypes};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {TypeActions, TypeStore};
