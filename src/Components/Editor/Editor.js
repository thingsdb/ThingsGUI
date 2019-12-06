import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import {withVlow} from 'vlow';

import SelectScope from './SelectScope';
import {ApplicationStore, CollectionActions, CollectionStore, ErrorActions, ProcedureActions, ProcedureStore, TypeActions} from '../../Stores';
import {ChipsCard, ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ProcedureStore,
}, {
    store: CollectionStore,
}]);

const tag = '13';

const Editor = ({match}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState({});
    const [queryInput, setQueryInput] = React.useState('');
    const [collapse, setCollapse] = React.useState(false);
    const [procedures, setProcedures] = React.useState([]);
    const [customTypes, setCustomTypes] = React.useState({});

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
        handleShrink();
        setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        setCollapse(false);
        setOutput(null);
        CollectionActions.queryEditor(scope.value, query, scope.collectionId, handleOutput, tag);
        handleGetAdditionals();
    };

    const handleKeyPress = (e) => {
        const {key, ctrlKey} = e;
        if (ctrlKey && key == 'Enter') {
            handleSubmit();
        }
    };

    const handleOutput = (out) => {
        setOutput(out);
    };

    const handleOnChangeScope = (s) => {
        handleCloseError();
        setScope(s);
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const handleShrink = () => {
        setCollapse(true);
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

    // Types
    const typesArr = [...Object.keys(customTypes).map((name) => (
        {
            name: name,
            definition: JSON.stringify(customTypes[name])
        }
    ))];

    const makeTypeInstanceInit = (key) => customTypes[key] ?
        `${key}{${Object.entries(customTypes[key]).map(([k, v]) =>`${k}: ${makeTypeInstanceInit(v)}` )}}`
        : `<${key}>`;

    const handleClickTypes = (index) => {
        const key = typesArr[index];
        const i = makeTypeInstanceInit(key.name);
        setQueryInput(i);
    };

    const handleClickDeleteTypes = (index, cb) => {
        const key = typesArr[index];
        TypeActions.deleteType(
            scope.value,
            key.name,
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
                        <Card id='editor'>
                            <CardContent onKeyDown={handleKeyPress} onClick={handleShrink}>
                                <ErrorMsg tag={tag} />
                                <Collapse in={collapse} collapsedHeight="40px">
                                    <QueryInput onChange={handleInput} input={queryInput} />
                                </Collapse>
                            </CardContent>
                            {/* <Divider />
                            <CardActions>
                                <Button
                                    onClick={handleSubmit}
                                    variant="text"
                                    color="primary"
                                    size="large"
                                >
                                    {<SendIcon />}
                                </Button>
                            </CardActions> */}
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
                            expand={!collapse}
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
                                title="procedures"
                                items={procedures}
                                onAdd={handleClickAddProcedure}
                                onClick={handleClickProcedure}
                                onDelete={handleClickDeleteProcedure}
                                tag={tag}
                            />
                        </Grid>
                    )}
                    {scope.value && scope.value.includes('@collection') ? (
                        <Grid item xs={12}>
                            <ChipsCard
                                title="custom types"
                                items={typesArr}
                                onAdd={handleClickAddTypes}
                                onClick={handleClickTypes}
                                onDelete={handleClickDeleteTypes}
                                tag={tag}
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