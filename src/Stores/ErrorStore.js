import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const ErrorActions = Vlow.createActions([
    'setToastError',
    'removeToastError',
    'resetToastError',
]);

// TODO: CALLBACKS
class ErrorStore extends BaseStore {

    static types = {
        toastErrors: PropTypes.arrayOf(PropTypes.string),
    }

    static defaults = {
        toastErrors: [],
    }

    constructor() {
        super(ErrorActions);
        this.state = ErrorStore.defaults;
    }

    onSetToastError(error) {
        const {toastErrors} = this.state;
        console.log(error, toastErrors);
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
}

export {ErrorActions, ErrorStore};