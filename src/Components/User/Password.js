import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Password extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            password: '',
        };
    }

    handleOnChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    handleClickOk = () => {
        const {user} = this.props;
        const {password} = this.state;
        ApplicationActions.password(user.name, password);
        this.setState({show: false});
    }

    handleClickOpen = () => {
        this.setState({show: true});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    render() {
        const {show, password} = this.state;

        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.handleClickOpen}>
                    {'Password'}
                </Button>
                <Dialog
                    open={show}
                    onClose={this.handleClickClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'Set password'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                        <TextField
                            autoFocus
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
                        <Button onClick={this.handleClickClose} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={this.handleClickOk} color="primary">
                            {'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

Password.propTypes = {
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    user: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(Password));