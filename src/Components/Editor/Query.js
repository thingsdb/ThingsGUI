import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionActions, CollectionStore} from '../../Stores/CollectionStore';
import {ProcedureActions, ProcedureStore} from '../../Stores/ProcedureStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {CardButton, ErrorMsg, HarmonicCard, TitlePage, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: ApplicationStore,
    keys: ['input']
}, {
    store: ProcedureStore,
}, {
    store: CollectionStore,
}]);

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    customWidth: {
        maxWidth: 500,
    },
}));

const tag = '20';

const Query = ({collections, input}) => {
    const classes = useStyles();
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [index, setIndex] = React.useState(0);
    const [queryInput, setQueryInput] = React.useState('');
    const [procedures, setProcedures] = React.useState([]);

    const scopes = [
        {name: 'ThingsDB', value: '@thingsdb', collectionId: null},
        {name: 'Node', value: '@node', collectionId: null},
        ...collections.map((c) => ({name: c.name, value: `@collection:${c.name}`, collectionId: c.collection_id}))
    ];

    React.useEffect(() => {
        setQueryInput(input);
    }, [input]);

    React.useEffect(() => {
        if (scopes[index].value == '@node') {
            setProcedures([]);
        } else {
            ProcedureActions.getProcedures(scopes[index].value, tag, handleSetProcedures);
        }
    }, [scopes[index].value]);

    const handleSetProcedures = (p) => {
        console.log('setProcedure', p);
        setProcedures(p);
    };

    const handleInput = (value) => {
        setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        console.log('SUBMIT');
        CollectionActions.queryEditor(query, scopes[index].value, scopes[index].collectionId, handleOutput, tag);
        if (query.includes('new_procedure') || query.includes('del_procedure')) {
            ProcedureActions.getProcedures(scopes[index].value, tag, handleSetProcedures);
        }
    };

    const handleOutput = (out) => {
        setOutput(out === null ? 'nil' : out);
    };

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setIndex(value);
    };

    const handleClickProcedure = (index) => () => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}', ...))` : `run('${procedures[index].name}', ...)`;
        setQueryInput(i);
    };

    const handleClickDeleteProcedure = (i) => () => {
        ProcedureActions.deleteProcedure(scopes[index].value, procedures[i].name, tag, handleSetProcedures);
    };

    const handleClickAddProcedure = () => {
        console.log("hi");
        setQueryInput('new_procedure("...", ...)');
    };

    return (
        <TitlePage
            preTitle='Customize your:'
            title='Query'
            content={
                <React.Fragment>
                    <Grid container spacing={1} item xs={9}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title="INPUT"
                                    titleTypographyProps={{variant: 'body1'}}
                                />
                                <CardContent>
                                    <ErrorMsg tag={tag} />
                                    <QueryInput onChange={handleInput} input={queryInput} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <HarmonicCard
                                title="OUTPUT"
                                content={
                                    <QueryOutput output={output} />
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item xs={3}>
                        <Grid container spacing={1} item xs={12}>
                            <Grid item xs={9}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body1">
                                            {'SCOPE'}
                                        </Typography>
                                        <RadioGroup aria-label="scope" name="scope" value={`${index}`} onChange={handleOnChangeScope}>
                                            {scopes.map((s, i) => (
                                                <FormControlLabel key={s.value} value={`${i}`} control={<Radio color='primary' />} label={s.name} />
                                            ))}
                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={3}>
                                <CardButton onClick={handleSubmit} title="Submit" style={{height: 80, width: 80}} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title="PROCEDURES"
                                    titleTypographyProps={{variant: 'body1'}}
                                />
                                <CardContent>
                                    {procedures ? procedures.map((listitem, index) => (
                                        <Tooltip
                                            key={index}
                                            disableFocusListener
                                            disableTouchListener
                                            classes={{ tooltip: classes.customWidth }}
                                            title={
                                                <Typography variant="caption">
                                                    {listitem.definition}
                                                </Typography>
                                            }
                                        >
                                            <Chip
                                                clickable
                                                id={listitem.name}
                                                className={classes.chip}
                                                label={listitem.name}
                                                onClick={handleClickProcedure(index)}
                                                onDelete={handleClickDeleteProcedure(index)}
                                                color="primary"
                                            />
                                        </Tooltip>
                                    )) : null}
                                </CardContent>
                                <CardActions>
                                    <Chip
                                        clickable
                                        className={classes.chip}
                                        label="ADD"
                                        onClick={handleClickAddProcedure}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        />
    );
};

Query.propTypes = {

    /* Application properties */
    input: ApplicationStore.types.input.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Query);