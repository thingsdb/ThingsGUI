import React, {useCallback, useState} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const initialState = {
    showPassword: false,
    errors: {},
    form: {
        host: '192.168.56.102:9200',
        user: 'admin',
        password: 'pass',
    },
};

const validation = {
    host: (o) => o.host.length>0,
    user: (o) => o.user.length>0,
    password: (o) => o.password.length>0,
};

const Login = () => {
    const [store, dispatch] = useStore();
    const {loaded, connected, connErr} = store;
    const [state, setState] = useState(initialState);
    const {showPassword, errors, form} = state;

    const connect = useCallback(AppActions.connect(dispatch, form));
    
    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !validation[e.target.id](form);
        setState({...state, form, errors});
    };

    const handleClickOk = () => {
        const errors = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky](form);  return d; }, {});
        setState({...state, errors});
        if (!Object.values(errors).some(d => d)) {
            connect();
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };
    
    return (
        <Dialog
            open={loaded && !connected}
            onClose={() => null}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                {'Login'}
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
                <TextField
                    margin="dense"
                    id="user"
                    label="User"
                    type="text"
                    value={form.user}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    error={errors.user}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type={showPassword?'text':'password'}
                    value={form.password}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    error={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                    {'Connect'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Login;