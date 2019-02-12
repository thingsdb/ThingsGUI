import React from 'react';
import Button from '@material-ui/core/Button';
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
    state = {
        host: '192.168.56.102:9200',
        user: 'iris',
        password: 'siri',
    };

    handleLogin = () => {
        const {host, user, password} = this.state;
        ApplicationActions.connect(host, user, password);
    };

    handleOnChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    render() {
        const {loaded, connected, connErr} = this.props;
        const {host, user, password} = this.state;

        return (
            <div>
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
                            value={host}
                            spellCheck={false}
                            onChange={this.handleOnChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="user"
                            label="User"
                            type="text"
                            value={user}
                            spellCheck={false}
                            onChange={this.handleOnChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="text"
                            value={password}
                            spellCheck={false}
                            onChange={this.handleOnChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleLogin} color="primary">
                            {'Connect'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Login.propTypes = {
    loaded: ApplicationStore.types.connected.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
    connErr: ApplicationStore.types.connErr.isRequired,
};

export default withStores(Login);