import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const ProcedureActions = Vlow.createActions([
    'getProcedures',
    'deleteProcedure',
]);

// TODO: CALLBACKS
class ProcedureStore extends BaseStore {

    constructor() {
        super(ProcedureActions);
    }

    onGetProcedures(scope, tag, cb) {
        const query = 'procedures_info()';
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

    onDeleteProcedure(scope, name, tag, cb) {
        const query = `del_procedure('${name}'); procedures_info();`;
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

export {ProcedureActions, ProcedureStore};
