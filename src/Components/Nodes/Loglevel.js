import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal } from '../Util';
import {NodesActions} from '../../Stores/NodesStore';


const loglevels = [
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'CRITICAL',
];

const initialState = {
    show: false,
    form: {},
    serverError: '',
};

const Loglevel = ({node}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, serverError} = state;

    const handleClickOpen = () => {
        setState({show: true, form: {...node}, serverError: ''});
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
        NodesActions.setLoglevel(
            node,
            form.log_level,
            (err) => setState({...state, serverError: err.log})
        );
        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <TextField
                autoFocus
                margin="dense"
                id="log_level"
                label="Loglevel"
                value={form.log_level}
                onChange={handleOnChange}
                fullWidth
                select
                SelectProps={{native: true}}
            >
                {loglevels.map(p => (
                    <option key={p} value={p}>
                        {p.toLowerCase()}
                    </option>
                ))}
            </TextField>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Loglevel'}
                </Button>
            }
            title="Set Loglevel"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Loglevel.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Loglevel;