import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ErrorMsg, QueryInput, QueryOutput} from '../Util';

const tag = '3';

const Query = ({collection}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState({});

    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryWithOutput(collection.collection_id, query, handleOutput, tag);
    };

    const handleOutput = (out) => {
        setOutput(out);
    };


    return (
        <Grid
            alignItems="stretch"
            container
            direction="column"
            justify="center"
            spacing={2}
        >
            <Grid item xs={12}>
                <ErrorMsg tag={tag} />
            </Grid>
            <Grid item container xs={12} spacing={2} alignItems="flex-start">
                <Grid item container xs={6} spacing={2}>
                    <Grid item xs={12}>
                        <QueryInput onChange={handleInput} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={handleSubmit}>
                            {'Submit'}
                        </Button>
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
    collection: PropTypes.object.isRequired,
};
export default Query;