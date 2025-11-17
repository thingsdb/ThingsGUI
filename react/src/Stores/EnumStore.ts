import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { NAME_ARGS, RENAME_ARGS } from '../TiQueries/Arguments';
import { DEL_ENUM_QUERY, ENUMS_INFO_QUERY, RENAME_ENUM_QUERY } from '../TiQueries/Queries';
import { ErrorActions } from './ErrorStore';

const EnumActions = Vlow.factoryActions<EnumStore>()([
    'getEnums',
    'deleteEnum',
    'renameEnum'
] as const);


class EnumStore extends BaseStore<IEnumStore> {

    static types = {
        enums: PropTypes.object,
    };

    static defaults: IEnumStore = {
        enums: {},
    };

    constructor() {
        super(EnumActions);
        this.state = EnumStore.defaults;
    }

    onGetEnums(scope: string, tag: string, cb=(_d: any)=>{}) {
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

    onDeleteEnum(scope: string, name: string, tag: string, cb=(_d: any)=>{}) {
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

    onRenameEnum(current: string, newName: string, scope: string, tag: string, cb=()=>{}) {
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

declare global {
    interface IEnum {
        enum_id: number;
        name: string;
        default: string | IThing;
        created_at: number;
        modified_at: number;
        members: [string, number | IThing][];
        // methods: {};  // same as IType.methods?

        // TODOT narrow in EnumTypeChips
        type_id?: number;
        wrap_only?: boolean;
        wpo?: boolean;  // TODO which one? wpo / wrap_only
        fields?: [string, string][];
        methods?: {
            [index: string]: {
                _doc: string;
                definition: string;
                with_side_effects: boolean;
                arguments: string[];
            }
        };
        relations?: {
            [index: string]: {
                type: string;
                property: string;
                definition: string;
            };
        };
    }

    interface IEnumStore {
        enums: {
            [index: string]: IEnum[];
        };
    }
}
