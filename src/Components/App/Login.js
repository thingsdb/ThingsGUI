import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { ErrorMsg } from '../Util';
import {ApplicationStore, ApplicationActions} from '../../Stores';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected']
}]);



const initialState = {
    showPassword: false,
    showToken: false,
    errors: {},
    loginWith: 'credentials',
    form: {
        address: 'localhost:9200',
        user: '',
        password: '',
        token: '',
        secureConnection: false,
        insecureSkipVerify: false,
    },

};

const validation = {
    address: (o) => o.address.length>0,
    user: (o) => o.token.length==0 ? o.user.length>0 : true,
    password: (o) => o.token.length==0 ? o.password.length>0 : true,
    token: (o) => o.password.length==0 ? o.token.length>0 : true,
};

const tag = '0';

const Login = ({loaded, connected}) => {
    const [state, setState] = React.useState(initialState);
    const {showPassword, showToken, errors, loginWith, form} = state;

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            ApplicationActions.connect(form, tag);
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };

    const handleClickShowToken = () => {
        setState({...state, showToken: !showToken});
    };

    const handleLoginWith = ({target}) => {
        const {value} = target;
        if (value=='credentials') {
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {user: '', password: ''});
                return {...prevState, form: updatedForm, loginWith: value, errors: {}};
            });
        } else {
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {token: ''});
                return {...prevState, form: updatedForm, loginWith: value, errors: {}};
            });
        }
    };

    const handleSwitchSSL = ({target}) => {
        const {id, checked} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: checked});
            return {...prevState, form: updatedForm};
        });
    };


    return (
        <Dialog
            open={loaded && !connected}
            onClose={() => null}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="sm"
            onKeyDown={handleKeyPress}
        >
            <DialogTitle id="form-dialog-title">
                {'Login'}
            </DialogTitle>
            <DialogContent>
                <ErrorMsg tag={tag} />
                <FormControl margin="none" size="small" fullWidth>
                    <RadioGroup aria-label="position" name="position" value={loginWith} onChange={handleLoginWith} row>
                        <FormControlLabel
                            value="credentials"
                            control={<Radio color="primary" />}
                            label="with credentials"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="token"
                            control={<Radio color="primary" />}
                            label="with token"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
                <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Socket Address"
                    type="text"
                    value={form.address}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    error={errors.address}
                />
                <Collapse in={loginWith=='credentials'} timeout="auto" unmountOnExit>
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
                <Collapse in={loginWith=='token'} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="token"
                        label="Token"
                        type={showToken?'text':'password'}
                        value={form.token}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.token}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowToken}>
                                        {showToken ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Collapse>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={form.secureConnection}
                            color="primary"
                            id="secureConnection"
                            onChange={handleSwitchSSL}
                        />
                    )}
                    label="Secure connection (TLS)"
                />
                <Collapse in={form.secureConnection} component="span" timeout="auto" unmountOnExit>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={form.insecureSkipVerify}
                                color="primary"
                                id="insecureSkipVerify"
                                onChange={handleSwitchSSL}
                            />
                        )}
                        label="Allow insecure certificates"
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