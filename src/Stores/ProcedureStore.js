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

    static types = {
        procedures: PropTypes.arrayOf(PropTypes.object),
    }

    static defaults = {
        procedures: [],
    }

    constructor() {
        super(ProcedureActions);
        this.state = ProcedureStore.defaults;
    }

    onGetProcedures(scope, tag) {
        const query = 'procedures_info()';
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                procedures: data
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }

    onDeleteProcedure(scope, name, tag) {
        const query = `del_procedure('${name}'); procedures_info();`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState({
                procedures: data
            });
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            return [];
        });
    }
}

export {ProcedureActions, ProcedureStore};
