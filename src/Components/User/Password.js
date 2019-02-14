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
            errors: {},
            form: {},
        };
    }

    validation = {
        password: (o) => o.password.length>0,
    }

    handleOnChange = (e) => {
        const {form, errors} = this.state;
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !this.validation[e.target.id](form, this.props);
        this.setState({form, errors});
    };

    handleClickOk = () => {
        const {user} = this.props;
        const {form} = this.state;
        const errors = Object.keys(this.validation).reduce((d, ky) => { d[ky] = !this.validation[ky](form, this.props);  return d; }, {});
        this.setState({errors});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.password(user.name, form.password);
            this.setState({show: false});
        }
    }

    handleClickOpen = () => {
        const form = {password: ''};
        this.setState({show: true, errors: {}, form});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    render() {
        const {show, errors, form} = this.state;

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
                            value={form.password}
                            spellCheck={false}
                            onChange={this.handleOnChange}
                            fullWidth
                            error={errors.password}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickClose} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={this.handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                            {'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

Password.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(Password));