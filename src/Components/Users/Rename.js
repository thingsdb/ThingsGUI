import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import { ThingsdbActions, useStore } from '../../Actions/ThingsdbActions';


const initialState = {
    show: false,
    errors: {},
    form: {},
};



const Rename = ({user}) => {
    const [store, dispatch] = useStore();
    const {users} = store;

    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const validation = {
        name: () => form.name.length>0&&users.every((u) => u.name!==form.name),
    };

    const handleClickOpen = () => {
        setState({show: true, errors: {}, form: {...user}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
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
            ThingsdbActions.renameUser(
                dispatch,
                user.name,
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
                <CardButton onClick={handleClickOpen} title="Rename" />
            }
            title="Rename user"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Rename.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Rename;