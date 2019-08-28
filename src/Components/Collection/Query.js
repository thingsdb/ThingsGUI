import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import QueryInput from '../Util/QueryInput';
import {CollectionActions} from '../../Stores/CollectionStore';

import {ErrorMsg} from '../Util';

const Query = ({collection}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState({});
    const [serverError, setServerError] = React.useState('');

    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryWithOutput(collection.collection_id, query, setOutput, handleServerError);
    };
    console.log(output);

    const handleServerError = (err) => {
        setServerError(err.log);
    };
    const handleCloseError = () => {
        setServerError('');
    };

    return (
        <Grid
            alignItems="stretch"
            container
            direction="column"
            justify="center"
            spacing={1}
        >
            <Grid item xs={12}>
                <ErrorMsg error={serverError} onClose={handleCloseError} />
            </Grid>
            <Grid item xs={12}>
                <QueryInput onChange={handleInput} />
            </Grid>
            {/* <Grid item xs={12}>
                <QueryOutput output={output} />
            </Grid> */}
            <Grid item xs={12}>
                <Button variant="outlined" onClick={handleSubmit}>
                    {'Submit'}
                </Button>
            </Grid>
        </Grid>

    );
};


Query.propTypes = {
    collection: PropTypes.object.isRequired,
};
export default Query;