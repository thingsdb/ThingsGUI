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

import {UsersActions, UsersActions} from '../../Stores/UsersStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: UsersStore,
    keys: ['users']
}]);

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const AddUser = ({classes, users}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const add = React.useCallback(
        () => {
            const onError = (err) => setState({...state, serverError: err});
            UsersActions.addUser(form.name, form.password, onError);
        },
        [form.name, form.password],
    );


    const validation = {
        name: () => form.name.length>0&&users.every((u) => u.name!==form.name),
        password: () => form.password.length>0,
    };

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                name: '',
                password: '',
            },
            serverError: '',
        });
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
            add();
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <Button className={classes.button} variant="contained" onClick={handleClickOpen}>
                {'Add'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'New user'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {serverError}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={form.name}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.name}
                        // helperText={users.some((u) => u.name===form.name)?'already exists':null}
                    />
                    <TextField
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

AddUser.propTypes = {
    /* styles properties */
    classes: PropTypes.object.isRequired,

    /* application properties */
    users: UsersStore.types.users.isRequired,
    
};

export default withStyles(styles)(withStores(AddUser)); // QUEST: volgorde goed zo?