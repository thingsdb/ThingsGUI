/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ApplicationStore, CollectionActions, EditorActions, EditorStore, ErrorActions, NodesActions} from '../../Stores';
import {ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';
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

const useStyles = makeStyles(() => ({
    dragger: {
        cursor: 'ns-resize',
    },
    background: {
        backgroundColor: '#000',
    },
}));

const tag = EditorTAG;

const Editor = ({match, history}) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [queryInput, setQueryInput] = React.useState('');

    const [isResizing, setIsResizing] = React.useState(false);
    const [newHeight, setNewHeight] = React.useState(200);
    const [expandOutput, setExpandOutput] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState(0);


    React.useEffect(() => {
        NodesActions.getNodes();
    },[]);

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        } else {
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[isResizing, handleMousemove, handleMouseup]);

    React.useEffect(() => {
        setQueryInput(match.item);
    }, [match.item]);


    const handleMousedown = () => {
        setIsResizing(true);
    };

    const handleMousemove = React.useCallback((event) => {
        let el = document.getElementById('editor');
        let height = event.clientY - el.offsetTop;
        if (height > 100) {
            setNewHeight(height);
        }

    }, []);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, []);


    const handleInput = (value) => {
        handleCloseError();
        setQuery(value);
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
        const {key, ctrlKey, keyCode} = e;
        if (ctrlKey && key == 'Enter') {
            handleSubmit();
        }
        if (ctrlKey && keyCode == '38') {
            setSuggestion(suggestion+1==history.length?0:suggestion+1);
            setQueryInput(history[suggestion]);
        }
    };

    const handleOutput = (out) => {
        setExpandOutput(true);
        setOutput(out);
    };

    const handleOnChangeScope = (s) => {
        handleCloseError();
        setScope(s);
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
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
                        <Card id='editor' style={{height: newHeight}} className={classes.background}>
                            <div onKeyUp={handleKeyUp}>
                                <QueryInput onChange={handleInput} input={queryInput} height={newHeight-25} />
                            </div>
                            <Grid container item xs={12} alignItems="flex-end" justify="center" >
                                <DragHandleIcon className={classes.dragger} onMouseDown={handleMousedown} />
                            </Grid>
                        </Card>
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
                            unmountOnExit={false}
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