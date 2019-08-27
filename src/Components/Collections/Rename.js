import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const Rename = ({collection, collections}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {...collection},
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const validation = {
        name: () => form.name.length>0&&collections.every((c) => c.name!==form.name),
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
            ThingsdbActions.renameCollection(
                collection.name,
                form.name,
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    const Content = (
        <React.Fragment>
            <ErrorMsg error={serverError} onClose={handleCloseError} />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={form.name}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.name}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Rename" />
            }
            title="Rename Collection"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Rename.propTypes = {
    collection: PropTypes.object.isRequired,

    /* collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Rename);