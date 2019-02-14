import React from 'react';
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
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'connErr'],
});

class Login extends React.Component {
    
    static propTypes = {
        loaded: ApplicationStore.types.connected.isRequired,
        connected: ApplicationStore.types.connected.isRequired,
        connErr: ApplicationStore.types.connErr.isRequired,
    };

    state = {
        showPassword: false,
        errors: {},
        form: {
            host: '',
            user: '',
            password: '',
        },
    };

    validation = {
        host: (o) => o.host.length>0,
        user: (o) => o.user.length>0,
        password: (o) => o.password.length>0,
    };

    handleOnChange = (e) => {
        const {form, errors} = this.state;
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !this.validation[e.target.id](form, this.props);
        this.setState({form, errors});
    };

    handleClickOk = () => {
        const {form} = this.state;
        const errors = Object.keys(this.validation).reduce((d, ky) => { d[ky] = !this.validation[ky](form, this.props);  return d; }, {});
        this.setState({errors});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.connect(form.host, form.user, form.password);
        }
    }

    handleClickShowPassword = () => {
        this.setState(state => ({showPassword: !state.showPassword}));
    };

    render() {
        const {loaded, connected, connErr} = this.props;
        const {showPassword, errors, form} = this.state;

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
                        onChange={this.handleOnChange}
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
                        onChange={this.handleOnChange}
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
                        onChange={this.handleOnChange}
                        fullWidth
                        error={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={this.handleClickShowPassword}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Connect'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStores(Login);