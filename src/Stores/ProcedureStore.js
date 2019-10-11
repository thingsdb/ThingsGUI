import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const ProcedureActions = Vlow.createActions([
    'getProcedures',
    'deleteProcedure',
]);

// TODO: CALLBACKS
class ProcedureStore extends BaseStore {

    // static types = {
    //     things: PropTypes.object,
    //     thingsByProp: PropTypes.object,
    // }

    // static defaults = {
    //     things: {},
    // }

    constructor() {
        super(ProcedureActions);
        // this.state = ProcedureStore.defaults;
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
