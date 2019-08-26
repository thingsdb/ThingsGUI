import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ErrorMsg } from '../Util';
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

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Loglevel'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set loglevel'}
                </DialogTitle>
                <DialogContent>
                    <ErrorMsg error={serverError} onClose={handleCloseError} />
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Loglevel.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Loglevel;