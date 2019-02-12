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

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            name: 'a',
            password: 'a',
        };
    }

    handleOnChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    handleClickOk = () => {
        const {name, password} = this.state;
        ApplicationActions.addUser(name, password);
        this.setState({show: false});
    }

    handleClickOpen = () => {
        this.setState({show: true});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    handleOnChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    render() {
        const {classes} = this.props;
        const {show, name, password} = this.state;

        return (
            <React.Fragment>
                <Button className={classes.button} variant="contained" onClick={this.handleClickOpen}>
                    {'Add'}
                </Button>
                <Dialog
                    open={show}
                    onClose={this.handleClickClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'New user'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            value={name}
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

AddUser.propTypes = {
    classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(AddUser));