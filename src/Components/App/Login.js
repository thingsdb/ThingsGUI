import React, {useState} from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ErrorMsg } from '../Util';
import ApplicationActions from '../../Actions/ApplicationActions';



const initialState = {
    showPassword: false,
    errors: {},
    serverError: '',
    form: {
        host: 'localhost:9200',
        user: 'admin',
        password: 'pass',
    },
};

const validation = {
    host: (o) => o.host.length>0,
    user: (o) => o.user.length>0,
    password: (o) => o.password.length>0,
};

const applicationActions = new ApplicationActions();

const Login = () => {
    const [state, setState] = useState(initialState);
    const {showPassword, errors, form, serverError} = state;
    const loaded = useGlobal('loaded')[0];
    const connected = useGlobal('connected')[0];
    const connErr = useGlobal('connErr')[0];


    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            applicationActions.connect(form);
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
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
                <ErrorMsg error={connErr || serverError} onClose={handleCloseError} />
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