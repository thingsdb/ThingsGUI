import PropTypes from 'prop-types';
import Vlow from 'vlow';

const ErrorActions = Vlow.createActions([
    'setToastError',
    'removeToastError',
    'resetToastError',
    'setMsgError',
    'removeMsgError',
]);


// TODO: CALLBACKS
class ErrorStore extends Vlow.Store {

    static types = {
        toastErrors: PropTypes.arrayOf(PropTypes.string),
        msgError: PropTypes.object,
    }

    static defaults = {
        toastErrors: [],
        msgError: {},
    }

    constructor() {
        super(ErrorActions);
        this.state = ErrorStore.defaults;
    }

    onSetToastError(error) {
        this.setState(prevState => {
            return({toastErrors: [...new Set([...prevState.toastErrors, error])]});
        });
    }

    onRemoveToastError(i) {
        this.setState(prevState => {
            const newArray = [...prevState.toastErrors];
            newArray.splice(i, 1);
            return {toastErrors: newArray};
        });
    }

    onResetToastError() {
        this.setState({toastErrors: []});
    }

    onSetMsgError(tag, error) {
        this.setState(prevState => {
            const err = Object.assign({}, prevState.msgError, {[tag]: error});
            return {msgError: err};
        });
    }

    onRemoveMsgError(tag) {
        this.setState(prevState => {
            let copyState = JSON.parse(JSON.stringify(prevState.msgError)); // copy
            delete copyState[tag];
            return {msgError: copyState};
        });
    }
}

export {ErrorActions, ErrorStore};