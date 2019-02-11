import PropTypes from 'prop-types';
import Vlow from 'vlow';

const MessageActions = Vlow.createActions([
    'add',
    'close',
]);

class MessageStore extends Vlow.Store {

    static types = {
        messages: PropTypes.arrayOf(PropTypes.object),
    }

    static defaults = {
        messages: [],
        closed: [],
    }

    constructor() {
        super(MessageActions);
        this.messageId = 0;
        this.state = MessageStore.defaults;
    }

    onAdd(message) {
        const {messages, closed} = this.state;
        message.id = ++this.messageId;
        if (message.log) {
            window.console.log(`Message log:\n${message.log}`);
        }
        if (message.display === 'visible_once' && messages.find((m) => m.text === message.text)) {
            return;
        }
        if (message.display === 'only_once' && (messages.find((m) => m.text === message.text) || closed.find((m) => m.text === message.text))) {
            return;
        }
        this.setState(prevState => ({
            messages: [...prevState.messages, message],
        }));
    }

    onClose(message) {
        this.setState(prevState => ({
            messages: prevState.messages.filter((m) => m !== message),
            closed: [...prevState.closed, message],
        }));
    }
}

export {MessageStore, MessageActions};