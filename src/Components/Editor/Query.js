import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';

import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {ErrorMsg, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: ApplicationStore,
    keys: ['input']
}]);

const tag = '20';

const Query = ({collections, input}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [index, setIndex] = React.useState(0);

    const scopes = [
        {name: 'ThingsDB', value: '@thingsdb', collectionId: null},
        {name: 'Node', value: '@node', collectionId: null},
        ...collections.map((c) => ({name: c.name, value: `@collection:${c.name}`, collectionId: c.collection_id}))
    ];


    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryEditor(scopes[index].value, scopes[index].collectionId, query, handleOutput, tag);
    };

    const handleOutput = (out) => {
        setOutput(out === null ? 'nil' : out);
    };

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setIndex(value);
    };


    return (
        <Grid
            container
            spacing={1}
        >
            <Grid item xs={12}>
                <ErrorMsg tag={tag} />
            </Grid>
            <Grid item container xs={12} spacing={2} alignItems="flex-start">
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <QueryInput onChange={handleInput} input={input} />
                    </Grid>
                    <Grid container item alignItems="flex-end" spacing={2} xs={12}>
                        <Grid item xs={6}>
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
                            <Button variant="outlined" onClick={handleSubmit}>
                                {'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <QueryOutput output={output} />
                </Grid>
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