import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';

import {UsersActions, UsersStore} from '../../Stores/UsersStore';

const withStores = withVlow([{
    store: UsersStore,
    keys: ['users']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const Rename = ({user, users}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        name: () => form.name.length>0&&users.every((u) => u.name!==form.name),
    };

    const handleClickOpen = () => {
        setState({show: true, errors: {}, form: {...user}, serverError: ''});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            UsersActions.renameUser(
                user.name, 
                form.name, 
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Rename'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Rename user'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>   
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

Rename.propTypes = {
    user: PropTypes.object.isRequired,

    /* application properties */
    users: UsersStore.types.users.isRequired,    
};

export default withStores(Rename);