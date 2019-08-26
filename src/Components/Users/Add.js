import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    buttonBase: {
        width: '100%',
        height: '100%',
        padding: 0,
        justifyContent: 'left',
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        '&:hover': {
            backgroundColor: '#303030',
        },
        text: 'italic',
    },
    icon: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        color: '#eee',
    },
}));

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const AddUser = ({users}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        name: () => form.name.length>0&&users.every((u) => u.name!==form.name),
        //password: () => form.password.length>0,
    };

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                name: '',
            },
            serverError: '',
        });
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
            ThingsdbActions.addUser(form.name, (err) => setState({...state, serverError: err.log}));
            
            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    return (
        <React.Fragment>
            <ButtonBase className={classes.buttonBase} onClick={handleClickOpen} >
                <AddBoxIcon className={classes.icon}/>
            </ButtonBase>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'New user'}
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

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,    
};

export default withStores(AddUser); // QUEST: volgorde goed zo?