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

const privileges = [
    'READ',
    'MODIFY',
    'WATCH',
    'GRANT',
    'FULL',
];

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const Grant = ({user}) => {
    const [store, dispatch] = useStore();
    const {collections} = store;
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;
    
    const grant = React.useCallback(AppActions.grant(dispatch, user.name, form.target, form.privileges));

    const validation = {
        target: () => form.target.length>0,
        privileges: () => form.privileges.length>0,
    };
    
    const handleClickOpen = () => {
        setState({
            show: true, 
            errors: {}, 
            form: {
                target: user.access.length?user.access[0].target:'', // TODOK
                privileges: user.access.length?user.access[0].privileges:'',
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
            grant();
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Grant'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Grant user privileges'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {connErr} */}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="target"
                        label="Collection"
                        value={form.target}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.target}
                        helperText={errors.target?'Select a collection':null}
                        select
                        SelectProps={{native: true}}
                    >
                        <option value="" disabled="disabled" />
                        {collections.map(c => (
                            <option key={c.collection_id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="privileges"
                        label="Privileges"
                        value={form.privileges}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.privileges}
                        helperText={errors.privileges?'Select privileges':null}
                        select
                        SelectProps={{native: true}}
                    >
                        <option value="" disabled="disabled" />
                        {privileges.map(p => (
                            <option key={p} value={p}>
                                {p.toLowerCase()}
                            </option>
                        ))}
                    </TextField>
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

Grant.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Grant);