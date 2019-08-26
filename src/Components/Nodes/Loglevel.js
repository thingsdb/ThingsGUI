import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {NodesActions} from '../../Stores/NodesStore';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
}));

const loglevels = [
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'CRITICAL',
];

const initialState = {
    show: false,
    form: {},
    serverError: '',
};

const Loglevel = ({node}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {show, form, serverError} = state;

    const handleClickOpen = () => {
        setState({show: true, form: {...node}, serverError: ''});
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
        NodesActions.setLoglevel(
            node, 
            form.log_level, 
            (err) => setState({...state, serverError: err.log})
        );
        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Loglevel'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set loglevel'}
                </DialogTitle>
                <DialogContent>
                    <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid item><Avatar className={classes.avatar}><WarningIcon className={classes.warning}/></Avatar></Grid>
                                <Grid item>{serverError}</Grid>
                                <Grid item> 
                                    <IconButton aria-label="settings" onClick={handleCloseError}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Collapse>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="log_level"
                        label="Loglevel"
                        value={form.log_level}
                        onChange={handleOnChange}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                    >
                        {loglevels.map(p => (
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
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Loglevel.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Loglevel;