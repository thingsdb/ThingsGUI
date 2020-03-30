/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ApplicationStore, CollectionActions, EditorActions, EditorStore, ErrorActions, NodesActions, ProcedureActions, TypeActions} from '../../Stores';
import {ChipsCard, ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput, WarnPopover} from '../Util';
import SelectScope from './SelectScope';


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

const tag = '12';

const Editor = ({match, history}) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState({});
    const [queryInput, setQueryInput] = React.useState('');
    const [procedures, setProcedures] = React.useState([]);
    const [customTypes, setCustomTypes] = React.useState([]);

    const [isResizing, setIsResizing] = React.useState(false);
    const [newHeight, setNewHeight] = React.useState(200);
    const [expandOutput, setExpandOutput] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');
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


    const handleTypes = (t) => {
        setCustomTypes(t);
    };

    const handleProcedures = (p) => {
        setProcedures(p);
    };

    const handleGetAdditionals = () => {
        if (scope.value&&!scope.value.includes('@node')) {
            ProcedureActions.getProcedures(scope.value, tag, handleProcedures);
        }
        if (scope.value&&scope.value.includes('collection')) {
            TypeActions.getTypes(scope.value, tag, handleTypes);
        }
    };

    React.useEffect(() => {
        setQueryInput(match.item);
    }, [match.item]);

    React.useEffect(() => {
        handleGetAdditionals();
    }, [scope]);

    const handleInput = (value) => {
        handleCloseError();
        // setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        setExpandOutput(false);
        setTimeout(()=> { // can result in -> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. in Editor (created by WithVlow()(Editor)) in WithVlow()(Editor) (created by App)
            setOutput(null);
            CollectionActions.queryEditor(scope.value, query, scope.collectionId, handleOutput, tag);
            handleGetAdditionals();
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

    // Procedures
    const handleClickProcedure = (index) => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )})`;
        setQueryInput(i);
    };

    const handleClickDeleteProcedure = (index, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope.value,
            procedures[index].name,
            tag,
            (p) => {
                cb();
                handleProcedures(p);
            }
        );
    };

    const handleClickAddProcedure = () => {
        setQueryInput('new_procedure("...", ...)');
    };
    const customTypeNames = [...customTypes.map(c=>c.name)];
    const makeTypeInstanceInit = (index, circularRefFlag, target) => {
        if (circularRefFlag[customTypes[index].name]) {
            setAnchorEl(target);
            setWarnDescription(`Circular reference detected in type ${customTypes[index].name}`);
            return '';
        } else {
            circularRefFlag[customTypes[index].name] = true;
        }
        return `${customTypes[index].name}{${customTypes[index].fields.map(c =>`${c[0]}: ${customTypeNames.includes(c[1]) ? makeTypeInstanceInit(customTypeNames.indexOf(c[1]), circularRefFlag, target) : `<${c[1]}>`}` )}}`;
    };

    const handleClickTypes = (index, target) => {
        const circularRefFlag = {};
        const i = makeTypeInstanceInit(index, circularRefFlag, target);
        setQueryInput(i);
    };

    const handleClickDeleteTypes = (index, cb, tag) => {
        TypeActions.deleteType(
            scope.value,
            customTypes[index].name,
            tag,
            (t) => {
                cb();
                handleTypes(t);
            }
        );
    };

    const handleClickAddTypes = () => {
        setQueryInput('set_type("...", {...})');
    };

    const handleCloseDelete = () => {
        setAnchorEl(null);
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
            sideContent={
                <React.Fragment>
                    <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} description={warnDescription} />
                    {scope&&scope.value && scope.value.includes('@node') ? null : (
                        <Grid item xs={12}>
                            <ChipsCard
                                expand={false}
                                items={procedures}
                                onAdd={handleClickAddProcedure}
                                onEdit={handleClickProcedure}
                                onDelete={handleClickDeleteProcedure}
                                title="procedures"
                            />
                        </Grid>
                    )}
                    {scope&&scope.value && scope.value.includes('@collection') ? (
                        <Grid item xs={12}>
                            <ChipsCard
                                expand={false}
                                items={customTypes}
                                onAdd={handleClickAddTypes}
                                onEdit={handleClickTypes}
                                onDelete={handleClickDeleteTypes}
                                title="custom types"
                            />
                        </Grid>
                    ): null}
                </React.Fragment>
            }
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