import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {ApplicationStore, CollectionActions, CollectionStore, ErrorActions, ProcedureActions, ProcedureStore, TypeActions} from '../../Stores';
import {ChipsCard, ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';
import SelectScope from './SelectScope';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ProcedureStore,
}, {
    store: CollectionStore,
}]);

const useStyles = makeStyles((theme) => ({
    dragger: {
        cursor: 'ns-resize',
    },
    background: {
        backgroundColor: '#000',
    },
}));

const tag = '13';

const Editor = ({match}) => {
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

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        } else {
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[isResizing]);

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
        setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        setExpandOutput(false);
        setTimeout(()=> {
            setOutput(null);
            CollectionActions.queryEditor(scope.value, query, scope.collectionId, handleOutput, tag);
            handleGetAdditionals();
        }, 300);
    };

    const handleKeyPress = (e) => {
        const {key, ctrlKey} = e;
        if (ctrlKey && key == 'Enter') {
            handleSubmit();
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
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` <${a}>` )})`;
        setQueryInput(i);
    };

    const handleClickDeleteProcedure = (index, cb) => {
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
    const makeTypeInstanceInit = (index) =>
        `${customTypes[index].name}{${customTypes[index].fields.map(c =>`${c[0]}: ${customTypeNames.includes(c[1]) ? makeTypeInstanceInit(customTypeNames.indexOf(c[1])) : `<${c[1]}>`}` )}}`;

    const handleClickTypes = (index) => {
        const i = makeTypeInstanceInit(index);
        setQueryInput(i);
    };

    const handleClickDeleteTypes = (index, cb) => {
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

    return (
        <TitlePage2
            preTitle='Customize your query:'
            title={scope.value||''}
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <ErrorMsg tag={tag} />
                        <Card id='editor' style={{height: newHeight}} className={classes.background}>
                            <div onKeyDown={handleKeyPress}>
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
                            }//"OUTPUT"
                            content={
                                <QueryOutput output={output} />
                            }
                            noPadding
                            expand={expandOutput}
                        />
                    </Grid>
                </React.Fragment>
            }
            sideContent={
                <React.Fragment>
                    <Grid item xs={12}>
                        <SelectScope scope={match.scope} onChangeScope={handleOnChangeScope} />
                    </Grid>
                    {scope.value && scope.value.includes('@node') ? null : (
                        <Grid item xs={12}>
                            <ChipsCard
                                expand={false}
                                items={procedures}
                                onAdd={handleClickAddProcedure}
                                onClick={handleClickProcedure}
                                onDelete={handleClickDeleteProcedure}
                                tag={tag}
                                title="procedures"
                            />
                        </Grid>
                    )}
                    {scope.value && scope.value.includes('@collection') ? (
                        <Grid item xs={12}>
                            <ChipsCard
                                expand={false}
                                items={customTypes}
                                onAdd={handleClickAddTypes}
                                onClick={handleClickTypes}
                                onDelete={handleClickDeleteTypes}
                                tag={tag}
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
};

export default withStores(Editor);