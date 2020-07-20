/* eslint-disable react-hooks/exhaustive-deps */
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ApplicationStore, CollectionActions, EditorActions, EditorStore, ErrorActions, NodesActions} from '../../Stores';
import {DragdownCard, ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';
import SelectScope from './SelectScope';
import EditorSideContent from './EditorSideContent';
import {EditorTAG} from '../../constants';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: EditorStore,
    keys: ['history']
}]);


const tag = EditorTAG;

const Editor = ({match, history}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [queryInput, setQueryInput] = React.useState('');

    const [expandOutput, setExpandOutput] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState(0);


    React.useEffect(() => {
        NodesActions.getNodes();
    },[]);

    React.useEffect(() => {
        setQueryInput(match.item);
    }, [match.item]);

    const handleOnChangeScope = (s) => {
        handleCloseError();
        setScope(s);
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const handleInput = (value) => {
        handleCloseError();
        setQuery(value);
    };

    const handleOutput = (out) => {
        setExpandOutput(true);
        setOutput(out);
    };

    const handleQueryInput = (value) => {
        setQueryInput(value);
    };

    const handleSubmit = () => {
        setExpandOutput(false);
        setTimeout(()=> { // can result in -> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. in Editor (created by WithVlow()(Editor)) in WithVlow()(Editor) (created by App)
            setOutput(null);
            CollectionActions.rawQuery(scope, query, tag, handleOutput);
        }, 300);

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
        <TitlePage2
            preTitle='Customize your query:'
            title={<SelectScope scope={match.scope} onChangeScope={handleOnChangeScope} />}
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card id='errMsg'>
                            <ErrorMsg tag={tag} />
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <DragdownCard>
                            {(height) => (
                                <div onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
                                    <QueryInput onChange={handleInput} input={queryInput} height={height-25} />
                                </div>
                            )}
                        </DragdownCard>
                    </Grid>
                    <Grid item xs={12}>
                        <HarmonicCard
                            title={
                                <Button
                                    onClick={handleSubmit}
                                    variant="text"
                                    color="primary"
                                    size="large"
                                >
                                    {'Submit'}
                                </Button>
                            }
                            content={
                                <QueryOutput output={output} />
                            }
                            noPadding
                            expand={expandOutput}
                        />
                    </Grid>
                </React.Fragment>
            }
            sideContent={<EditorSideContent scope={scope} onSetQueryInput={handleQueryInput} tag={tag} />}
        />
    );
};

Editor.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Editor properties */
    history: EditorStore.types.history.isRequired,
};

export default withStores(Editor);