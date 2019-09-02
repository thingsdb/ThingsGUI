import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal } from '../Util';
import { ThingsdbActions, useStore } from '../../Actions/ThingsdbActions';




const initialState = {
    show: false,
    errors: {},
    form: {},
};

const Rename = ({collection}) => {
    const [store, dispatch] = useStore();
    const {collections} = store;

    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {...collection},
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
                dispatch,
                collection.name,
                form.name,
            );
            setState({...state, show: false});

        }
    };

    const Content = (
        <React.Fragment>
            {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
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
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Rename'}
                </Button>
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
};

export default Rename;