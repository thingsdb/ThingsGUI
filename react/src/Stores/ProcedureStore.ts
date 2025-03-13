//@ts-nocheck
import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { ErrorActions } from './ErrorStore';
import {
    NAME_ARGS,
    RENAME_ARGS,
} from '../TiQueries/Arguments';
import {
    DEL_PROCEDURE_QUERY,
    PROCEDURE_INFO_QUERY,
    PROCEDURES_INFO_QUERY,
    RENAME_PROCEDURE_QUERY,
} from '../TiQueries/Queries';

const ProcedureActions = Vlow.createActions([
    'getProcedure',
    'getProcedures',
    'deleteProcedure',
    'renameProcedure',
    'runProcedure'
]);


class ProcedureStore extends BaseStore {

    static types = {
        procedure: PropTypes.object,
        procedures: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)),
    };

    static defaults = {
        procedure: {},
        procedures: {},
    };

    constructor() {
        super(ProcedureActions);
        this.state = ProcedureStore.defaults;
    }

    onGetProcedure(scope, tag=null, cb=()=>null) {
        const query = PROCEDURE_INFO_QUERY;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                procedure: data
            });
            cb(data);
        }).fail((event, status, message) => {
            tag===null?ErrorActions.setMsgError(tag, message.Log):ErrorActions.setToastError(message.Log);
            return [];
        });
    }

    onGetProcedures(scope, tag,  cb=()=>null) {
        const query = PROCEDURES_INFO_QUERY;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const procedures = Object.assign({}, prevState.procedures, {[scope]: data});
                return {procedures};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteProcedure(scope, name, tag,  cb=()=>null) {
        const query = DEL_PROCEDURE_QUERY + ' ' + PROCEDURES_INFO_QUERY;
        const jsonArgs = NAME_ARGS(name);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const procedures = Object.assign({}, prevState.procedures, {[scope]: data});
                return {procedures};
            });
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onRunProcedure(scope, name, args, tag,  cb=()=>null, failCb=()=>null) {
        this.emit('run', {
            scope,
            procedure: {
                name: name,
                arguments: args
            },
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            failCb();
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameProcedure(current, newName, scope, tag, cb=()=>null) {
        const query = RENAME_PROCEDURE_QUERY + ' ' + PROCEDURES_INFO_QUERY;
        const jsonArgs = RENAME_ARGS(current, newName);
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const procedures = Object.assign({}, prevState.procedures, {[scope]: data});
                return {procedures};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {ProcedureActions, ProcedureStore};

declare global {
    interface IProcedureStore {
        procedure: any;
        procedures: any[];
    }
}