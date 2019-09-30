import React from 'react';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {withVlow} from 'vlow';

import { ErrorMsg } from '../Util';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected']
}]);



const initialState = {
    showPassword: false,
    errors: {},
    switches: false, //siwtches instead of switch (reserved word)
    form: {
        host: 'localhost:9200',
        user: '',
        password: '',
        token: '',
    },

};

const validation = {
    host: (o) => o.host.length>0,
    user: (o) => o.user.length>0,
    password: (o) => o.password.length>0,
    token: () => null,
};

const tag = '0';

const Login = ({loaded, connected}) => {
    const [state, setState] = React.useState(initialState);
    const {showPassword, errors, switches, form} = state;

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
            ApplicationActions.connect(form, tag);
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setState({...state, switches: checked});
    };


    return (
        <Dialog
            open={loaded && !connected}
            onClose={() => null}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle id="form-dialog-title">
                {'Login'}
            </DialogTitle>
            <DialogContent>
                <ErrorMsg tag={tag} />
                <Collapse in={!switches} timeout="auto" unmountOnExit>
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
                </Collapse>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switches}
                            color="primary"
                            id="swicthToken"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Use token"
                />
                <Collapse in={switches} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="token"
                        label="Token"
                        type="text"
                        value={form.token}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.token}
                    />
                </Collapse>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                    {'Connect'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

Login.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
};

export default withStores(Login);