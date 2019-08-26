import React, {useState} from 'react';
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
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
}));

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['connErr']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {
        host: 'localhost:9200',
    },
    serverError: '',
};


const Connect = ({connErr, onConnected}) => {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        host: () => form.host.length>0,
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickCancel = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.connectOther(form, (err) => setState({...state, serverError: err.log}));

            if(!state.serverError) {
                setState({...state, show: false});
                onConnected();
            }
        }
    };

    const handleClickConnect = () => {
        setState({...state, show: true});
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickConnect}>
                {'Connect'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickCancel}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Connect to other node'}
                </DialogTitle>
                <DialogContent>
                    <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid item><Avatar className={classes.avatar}><WarningIcon className={classes.warning}/></Avatar></Grid>
                                <Grid item>{connErr || serverError}</Grid>
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
                        id="host"
                        label="Host"
                        type="text"
                        value={form.host}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.host}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Connect'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
};

Connect.propTypes = {

    /* application properties */
    connErr: ApplicationStore.types.connErr.isRequired,
};

export default withStores(Connect);