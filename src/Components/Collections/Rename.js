import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useCollections, CollectionsActions} from '../../Stores/CollectionsStore';

const initialState = {
    show: false,
    form: {},
    errors: {},
};

const Rename = ({collection}) => {
    const [store, dispatch] = useCollections();
    const {collections} = store;
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const rename = React.useCallback(CollectionsActions.renameCollection(dispatch, collection.name, form.name));

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {...collection},
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const validation = {
        name: () => form.name.length>0&&collections.every((c) => c.name!==form.name),
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
            rename();
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Rename'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Rename collection'}
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
                        {'Rename'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Rename.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Rename;