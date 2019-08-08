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

import {CollectionActions} from '../../Stores/CollectionStore';

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const RenameProperty = ({collection, things}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                thingId: '',
                oldname: '',
                newname: '',
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const validation = {
        thingId: () => form.thingId.length>0,
        oldname: () => form.oldname.length>0,
        newname: () => form.newname.length>0,
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
            CollectionActions.renameKey(
                collection,
                form.thingId, 
                form.oldname, 
                form.newname,
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
                {'Rename Property'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Rename Property'}
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
                        id="thingId"
                        label="Thing ID"
                        type="text"
                        value={form.thingId}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.thingId}
                    />
                    <TextField
                        margin="dense"
                        id="oldname"
                        label="Current Name"
                        type="text"
                        value={form.oldname}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.oldname}
                    />
                    <TextField
                        margin="dense"
                        id="newname"
                        label="New name"
                        type="text"
                        value={form.newname}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.newname}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Rename'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

RenameProperty.propTypes = {
    collection: PropTypes.object.isRequired,
    things: PropTypes.object.isRequired,
};

export default RenameProperty;