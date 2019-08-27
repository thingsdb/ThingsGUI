import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import QueryInput from '../Util/QueryInput';
import {CollectionActions} from '../../Stores/CollectionStore';


const Query = ({collection, onError}) => {
    const [query, setQuery] = React.useState('');
    const handleInput = (value) => {
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.rawQuery(collection.collection_id, collection.collection_id, query, onError);
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
                <QueryInput onChange={handleInput} />
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" onClick={handleSubmit}>
                    {'Submit'}
                </Button>
            </Grid>
        </Grid>

    );
};


Query.propTypes = {
    onError: PropTypes.func.isRequired,

    collection: PropTypes.object.isRequired,

};
export default Query;