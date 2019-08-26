import PropTypes from 'prop-types';
import Vlow from 'vlow';

const MessageActions = Vlow.createActions([
    'add',
    'remove',
    'removeByIdx',
]);

class MessageStore extends Vlow.Store {

    static types = {
        messages: PropTypes.arrayOf(PropTypes.string),
    }

    static defaults = {
        messages: [],
    }

    constructor() {
        super(MessageActions);
        this.state = MessageStore.defaults;
    }

    onAdd(message) {
        this.setState(prev => ({
            messages: [...prev.messages, message]
        }));
    }

    onRemove(message) {
        this.setState(prev => ({
            messages: prev.messages.filter((m) => m != message),
        }));
    }

    onRemoveByIdx(messageIdx) {
        this.setState(prev => ({
            messages: prev.messages.filter((_, i) => i != messageIdx),
        }));
    }
}

export {MessageActions, MessageStore};