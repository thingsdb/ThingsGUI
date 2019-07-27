import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
    const {show, form} = state;
    const setLoglevel = React.useCallback(
        () => {
            const onError = (err) => setState({...state, serverError: err});
            NodesActions.setLoglevel(node, form.log_level, onError);
        },
        [node, form.log_level],
    );

    const handleClickOpen = () => {
        setState({show: true, form: {...node}, serverError: ''});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value;
        setState({...state, form});
    };

    const handleClickOk = () => {
        setLoglevel();
        setState({...state, show: false});
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Loglevel'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set loglevel'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {serverError}
                    </DialogContentText>
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