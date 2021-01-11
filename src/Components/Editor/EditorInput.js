/* eslint-disable react-hooks/exhaustive-deps */
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import React from 'react';
import PropTypes from 'prop-types';

import {ApplicationStore, CollectionActions, EditorActions, EditorStore, ErrorActions} from '../../Stores';
import {QueryInput} from '../Util';
import {EditorTAG} from '../../constants';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: EditorStore,
    keys: ['history']
}]);

const useStyles = makeStyles(() => ({
    cardAction: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 0
    },
}));


const tag = EditorTAG;




const Editor = ({height, history, input, match, onExpand, onOutput, scope}) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState('');
    const [queryInput, setQueryInput] = React.useState('');
    const [suggestion, setSuggestion] = React.useState(0);

    React.useEffect(() => {
        setQueryInput(match.item);
    }, [match.item]);

    React.useEffect(() => {
        setQueryInput(input);
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
        // onExpand(false);
        // onOutput(null);
        CollectionActions.rawQuery(scope, query, tag, handleOutput);
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
                <QueryInput onChange={handleInput} input={queryInput} height={height-75} />
            </div>
            <CardActions className={classes.cardAction} disableSpacing>
                <Button
                    onClick={handleSubmit}
                    variant="text"
                    color="primary"
                    size="medium"
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

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Editor properties */
    history: EditorStore.types.history.isRequired,
};

export default withStores(Editor);