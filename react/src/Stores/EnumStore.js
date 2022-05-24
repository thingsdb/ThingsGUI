import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { NAME_ARGS, RENAME_ARGS } from '../TiQueries/Arguments';
import { DEL_ENUM_QUERY, ENUMS_INFO_QUERY, RENAME_ENUM_QUERY } from '../TiQueries/Queries';
import { ErrorActions } from './ErrorStore';

const EnumActions = Vlow.createActions([
    'getEnums',
    'deleteEnum',
    'renameEnum'
]);


class EnumStore extends BaseStore {

    static types = {
        enums: PropTypes.object,
    };

    static defaults = {
        enums: {},
    };

    constructor() {
        super(EnumActions);
        this.state = EnumStore.defaults;
    }

    onGetEnums(scope, tag, cb=()=>null) {
        const query = ENUMS_INFO_QUERY;
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
        const query = DEL_ENUM_QUERY + ' ' + ENUMS_INFO_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
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

    onRenameEnum(current, newName, scope, tag, cb=()=>null) {
        const query = RENAME_ENUM_QUERY + ENUMS_INFO_QUERY;
        const jsonArgs = RENAME_ARGS(current, newName);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const enums = Object.assign({}, prevState.enums, {[scope]: data});
                return {enums};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {EnumActions, EnumStore};
