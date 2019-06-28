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
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const Password = ({user}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const setPassword = React.useCallback(AppActions.password(dispatch, user.name, form.password));

    const validation = {
        password: () => form.password.length>0,
    };

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, form: {...user, password: ''}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
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
            setPassword();
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Password'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
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
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.password}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Password.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Password);