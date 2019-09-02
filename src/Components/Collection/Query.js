import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';

import { CollectionActions, useStore } from '../../Actions/CollectionActions';
import {ErrorMsg, QueryInput, QueryOutput} from '../Util';



const Query = ({collection}) => {
    const dispatch = useStore()[1];
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState({});

    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryWithOutput(dispatch, collection.collection_id, query, handleOutput);
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
                {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
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