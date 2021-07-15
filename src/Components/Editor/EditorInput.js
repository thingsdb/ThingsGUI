import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import PropTypes from 'prop-types';
import React from 'react';

import {CollectionActions, EditorActions, EditorStore, ErrorActions} from '../../Stores';
import {historyGetQueryParam, QueryInput} from '../Util';
import {EditorTAG} from '../../Constants/Tags';


const withStores = withVlow([{
    store: EditorStore,
    keys: ['history']
}]);

const useStyles = makeStyles(theme => ({
    cardAction: {
        paddingTop: theme.spacing(1),
        paddingBottom: 0,
        paddingLeft: theme.spacing(2),
        paddingRight: 0
    },
}));


const tag = EditorTAG;
const Editor = ({height, history, input, onExpand, onOutput, scope}) => {
    let routerHistory = useHistory();
    const classes = useStyles();

    const [query, setQuery] = React.useState('');
    const [queryInput, setQueryInput] = React.useState(() => {
        let query = historyGetQueryParam(routerHistory, 'query');
        if (query) {
            return query;
        } else {
            return '';
        }
    });
    const [suggestion, setSuggestion] = React.useState(0);

    React.useEffect(() => {
        if(input){
            setQueryInput(input);
        }
    }, [input]);

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const handleInput = (value) => {
        handleCloseError();
        setQuery(value);
    };

    const handleOutput = (out) => {
        onExpand(true);
        onOutput(out);
    };

    const handleSubmit = () => {
        onExpand(false);
        setTimeout(()=> { // can result in -> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. in Editor (created by WithVlow()(Editor)) in WithVlow()(Editor) (created by App)
            onOutput(null);
            CollectionActions.query(scope, query, tag, handleOutput);
        }, 100);

        EditorActions.setHistory(query);
    };

    const handleKeyUp = (e) => {
        const {ctrlKey, keyCode} = e;
        if (ctrlKey) {
            switch(keyCode) {
            case 13: // ENTER
                handleSubmit();
                break;
            case 38: // ARROW UP
                if (history.length) {
                    let s = goUpTheList(suggestion-1, history.length);
                    handleSuggestion(s);
                }
                break;
            case 40: // ARROW DOWN
                if (history.length) {
                    let s = goDownTheList(suggestion+1, history.length);
                    handleSuggestion(s);
                }
                break;
            }
        }
    };

    const handleKeyDown = (e) => { // capture CTRL-SHIFT-c/v
        const {ctrlKey, keyCode, shiftKey} = e;
        if (ctrlKey && shiftKey) {
            switch(keyCode) {
            case 86: // v
            case 67: // c
                e.preventDefault();
                break;
            }
        }
    };

    const goDownTheList = (s, length) => s==length?0:s;
    const goUpTheList = (s, length) => s<0?length-1:s;

    const handleSuggestion = (s) => {
        setSuggestion(s);
        setQueryInput(history[s]);
    };

    return (
        <React.Fragment>
            <div onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
                <QueryInput onChange={handleInput} input={queryInput} height={height-60} />
            </div>
            <CardActions className={classes.cardAction} disableSpacing>
                <Button
                    onClick={handleSubmit}
                    variant="outlined"
                    color="primary"
                    size="small"
                >
                    {'Submit'}
                </Button>
            </CardActions>
        </React.Fragment>
    );
};

Editor.propTypes = {
    height: PropTypes.number.isRequired,
    input: PropTypes.string.isRequired,
    onExpand: PropTypes.func.isRequired,
    onOutput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* Editor properties */
    history: EditorStore.types.history.isRequired,
};

export default withStores(Editor);