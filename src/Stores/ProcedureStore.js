import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

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
    }

    static defaults = {
        procedure: {},
        procedures: {},
    }

    constructor() {
        super(ProcedureActions);
        this.state = ProcedureStore.defaults;
    }

    onGetProcedure(scope, tag=null, cb=()=>null) {
        const query = 'procedure_info()';
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
        const query = 'procedures_info()';
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
        const query = `del_procedure('${name}'); procedures_info();`;
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

    onRunProcedure(scope, name, jsonProofArgs, tag,  cb=()=>null) {
        this.emit('run', {
            scope,
            procedure: {
                name: name,
                arguments: jsonProofArgs
            },
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRenameProcedure(oldName, newName, scope, tag, cb=()=>null) {
        const query = `rename_procedure('${oldName}', '${newName}'); procedures_info();`;
        this.emit('query', {
            query,
            scope
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
