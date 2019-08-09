import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import {NodesActions} from '../../Stores/NodesStore';

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '', 
};

const AddNode = () => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        secret: () => form.secret.length>0,
        ipAddress: () => form.ipAddress.length>0, // TODOs validate regex
        port: () => true,
    };

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, form: {secret: '', ipAddress: '', port: ''}, serverError: ''});
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
            NodesActions.addNode(
                form,
                (err) => setState({...state, serverError: err.log})
            );
            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Add node'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Add node'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>  
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="secret"
                        label="Secret"
                        type="text"
                        value={form.secret}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.secret}
                    />
                    <TextField
                        margin="dense"
                        id="ipAddress"
                        label="IP address"
                        type="text"
                        value={form.ipAddress}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.ipAddress}
                    />
                    <TextField
                        margin="dense"
                        id="port"
                        label="Port"
                        type="text"
                        value={form.port}
                        spellCheck={false}
                        onChange={handleOnChange} 
                        fullWidth
                        error={errors.port}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AddNode;