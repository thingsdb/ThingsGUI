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
import {CollectionsActions, useCollections} from '../../Stores/CollectionsStore';

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const Add = ({classes}) => {
    const [store, dispatch] = useCollections();
    const {collections, connErr} = store;
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const add = React.useCallback(CollectionsActions.addCollection(dispatch, form.name));

    const validation = {
        name: () => form.name.length>0&&collections.every((c) => c.name!==form.name),
    };

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                name: '',
            },
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
                    {'New collection'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {connErr}
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

Add.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Add);