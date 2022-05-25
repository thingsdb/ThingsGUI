import PropTypes from 'prop-types';
import Vlow from 'vlow';

const EditorActions = Vlow.createActions([
    'setHistory',
]);


class EditorStore extends Vlow.Store {

    static types = {
        history: PropTypes.arrayOf(PropTypes.string),
    };

    static defaults = {
        history: [],
    };

    constructor() {
        super(EditorActions);
        this.state = EditorStore.defaults;
    }

    onSetHistory(line) {
        this.setState(prevState => {
            const copy = [...prevState.history];
            copy.push(line);
            if (copy.length>20) {
                copy.splice(0, 1);
            }
            return({history: copy});
        });
    }

}

export {EditorActions, EditorStore};