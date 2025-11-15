//@ts-nocheck
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import { NAME_ARGS, RENAME_ARGS } from '../TiQueries/Arguments';
import {
    DEL_TYPE_QUERY,
    RENAME_TYPE_QUERY,
    TYPES_INFO_QUERY,
} from '../TiQueries/Queries';

const TypeActions = Vlow.factoryActions<TypeStore>()([
    'getType',
    'getTypes',
    'deleteType',
    'renameType'
] as const);


class TypeStore extends BaseStore {

    static types = {
        customTypes: PropTypes.object,
    };

    static defaults = {
        customTypes: {},
    };

    constructor() {
        super(TypeActions);
        this.state = TypeStore.defaults;
    }

    onGetType(query, scope, args, tag, cb) {
        this.emit('query', {
            query,
            scope,
            arguments: args
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
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
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
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

    onRenameType(current, newName, scope, tag, cb=()=>null) {
        const query = RENAME_TYPE_QUERY + ' ' + TYPES_INFO_QUERY;
        const jsonArgs = RENAME_ARGS(current, newName);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
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

declare global {
    interface IType {
        type_id: number;
        name: string;
        wrap_only: boolean;
        hide_id: boolean;
        created_at: number;
        modified_at: number;
        fields: [string, string][];
        methods: {
            [index: string]: {
                _doc: string;
                definition: string;
                with_side_effects: boolean;
                arguments: string[];
            }
        };
        relations: {
            [index: string]: {
                type: string;
                property: string;
                definition: string;
            };
        };

        // TODOT narrow in EnumsTypes
        enum_id?: number;
    }

    interface ITypeStore {
        customTypes: {
            [index: string]: IType[];
        }
    }
}
