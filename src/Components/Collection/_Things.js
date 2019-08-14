/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {ServerError} from '../Util';

import Thing2 from './_Thing';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['thingsByProp']
}]);


const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

const initialState = {
    errors: {},
    form: {
        property: '',
        depth: '',
        thingId: '',
    },
    serverError: '',
};

const Things2 = ({classes, thingsByProp, collection}) => {
    const [state, setState] = React.useState(initialState);
    const {errors, form, serverError} = state;

    const fetched = thingsByProp.hasOwnProperty(collection.collection_id);

    const validation = {
        thingId: () => form.thingId.length>0,
        property: () => form.property.length>0,
        depth: () => form.depth.length>0,
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            CollectionActions.property(collection.collection_id, form.thingId, form.property, (err) => setState({...state, serverError: err.log}), form.depth);
        }
    } 

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }
    const openError = Boolean(serverError); 

    return (
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <Grid item container xs={12} spacing={1} >
                <Grid item xs={3} >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="thingId"
                        label="ID of thing"
                        type="text"
                        value={form.thingId}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.thingId}
                    />
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        margin="dense"
                        id="property"
                        label="Property"
                        type="text"
                        value={form.property}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.property}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        margin="dense"
                        id="depth"
                        label="Depth"
                        type="text"
                        value={form.depth}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.depth}
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={handleClickOk} disabled={Object.values(errors).some(d => d)}>
                        <SearchIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {fetched ? (
                <List
                    component="nav"
                    className={classes.root}
                    dense
                >
                    {Object.entries(thingsByProp[collection.collection_id]).map(([k, v]) => k === '#' ? null : (
                        <Thing2 key={k} thing={v} name={k} collection={collection} />
                    ))}
                </List>
            ) : null}
        </React.Fragment>
    );
};

Things2.propTypes = {
    collection: PropTypes.object.isRequired, 

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,

    /* collection properties */
    thingsByProp: CollectionStore.types.thingsByProp.isRequired,
};


export default withStyles(styles)(withStores(Things2));