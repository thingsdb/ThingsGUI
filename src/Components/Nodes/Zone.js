import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {NodesActions, useStore} from '../../Stores/NodesStore';


const zones = [...Array(128).keys()];

const initialState = {
    show: false,
    form: {},
};

const Zone = ({node}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    const [state, setState] = React.useState(initialState);
    const {show, form} = state;
    const setZone = React.useCallback(NodesActions.setZone(dispatch, node, form.zone));

    const handleClickOpen = () => {
        setState({show: true, form: {...node}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value;
        setState({...state, form});
    };

    const handleClickOk = () => {
        setZone();
        setState({...state, show: false});
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Zone'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set zone'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {connErr} */}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="zone"
                        label="Zone"
                        value={form.zone}
                        onChange={handleOnChange}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                    >
                        {zones.map(p => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Zone.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Zone;