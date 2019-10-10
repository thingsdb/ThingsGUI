import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {ErrorMsg, HarmonicCard, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: ApplicationStore,
    keys: ['input']
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
            CollectionActions.getProcedures(scopes[index].value, tag, handleSetProcedures);
        }
    }, [scopes[index].value]);

    const handleSetProcedures = (p) => {
        setProcedures(p);
    };

    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryEditor(query, scopes[index].value, scopes[index].collectionId, handleOutput, tag);
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

    const makeProcedureList = () => {
        const elements = procedures ? procedures.map((listitem, index) => (
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
                    color="primary"
                />
            </Tooltip>
        )) : null;
        return elements;
    };
    console.log("EDITOR", procedures);

    return (
        <Grid
            container
            spacing={1}
        >
            <Grid item xs={12}>
                <HarmonicCard
                    title="INPUT"
                    content={
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid item xs={12}>
                                <ErrorMsg tag={tag} />
                            </Grid>
                            <Grid item xs={12}>
                                <QueryInput onChange={handleInput} input={queryInput} />
                            </Grid>
                            <Grid container item alignItems="flex-end" spacing={2} xs={12}>
                                <Grid item xs={4}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="scope"
                                        label="Scope"
                                        value={index}
                                        onChange={handleOnChangeScope}
                                        fullWidth
                                        select
                                        SelectProps={{native: true}}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        {scopes.map((s, i) => (
                                            <option key={s.value} value={i}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    {makeProcedureList()}
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="outlined" onClick={handleSubmit}>
                                        {'Submit'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <HarmonicCard
                    title="OUTPUT"
                    content={
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid item xs={12}>
                                <QueryOutput output={output} />
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
        </Grid>

    );
};

Query.propTypes = {

    /* Application properties */
    input: ApplicationStore.types.input.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Query);