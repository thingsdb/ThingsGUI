import React, {useCallback, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const initialState = {
    show: false,
    errors: {},
    form: {
        host: 'localhost:9200',
    },
};


const Login = () => {
    const [store, dispatch] = useStore();
    const {connErr} = store;
    const [state, setState] = useState(initialState);
    const {show, errors, form} = state;

    const connect = useCallback(AppActions.connectOther(dispatch, form));

    const validation = {
        host: () => form.host.length>0,
    };


    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !validation[e.target.id]();
        setState({...state, form, errors});
    };

    const handleClickOk = () => {
        const errors = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors});
        if (!Object.values(errors).some(d => d)) {
            connect();
            setState({...state, show: false});
        }
    };

    const handleClickConnect = () => {
        setState({...state, show: true});
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickConnect}>
                {'Connect'}
            </Button>
            <Dialog
                open={show}
                onClose={() => null}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Connect to other node'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {connErr}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="host"
                        label="Host"
                        type="text"
                        value={form.host}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.host}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Connect'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
};

export default Login;