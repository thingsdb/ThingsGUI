import { useSearchParams } from 'react-router-dom';
import { withVlow } from 'vlow';
import CardActions from '@mui/material/CardActions';
import PropTypes from 'prop-types';
import React from 'react';

import { EditorActions, EditorStore, ErrorActions } from '../../Stores';
import { EditorTAG } from '../../Constants/Tags';
import { QueryInput } from '../Utils';
import SubmitButton from './SubmitButton';


const withStores = withVlow([{
    store: EditorStore,
    keys: ['history']
}]);


const tag = EditorTAG;
const Editor = ({height, history, input, loading, onQuery}) => {
    let searchParams = useSearchParams()[0];

    const [query, setQuery] = React.useState(() => {
        let query = searchParams.get('query');
        if (query) {
            return query;
        } else {
            return '';
        }
    });
    const [queryInput, setQueryInput] = React.useState(() => {
        let query = searchParams.get('query');
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

    const handleSubmit = () => {
        onQuery(query);
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
            <CardActions disableSpacing sx={{padding: '8px 0px 0px 16px'}}>
                <SubmitButton loading={loading} onClickSubmit={handleSubmit} />
            </CardActions>
        </React.Fragment>
    );
};

Editor.propTypes = {
    height: PropTypes.number.isRequired,
    input: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    onQuery: PropTypes.func.isRequired,

    /* Editor properties */
    history: EditorStore.types.history.isRequired,
};

export default withStores(Editor);