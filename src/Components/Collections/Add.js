import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionsActions, CollectionsStore} from '../../Stores/CollectionsStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['connErr']
}, {
    store: CollectionsStore,
    keys: ['collections']
}]);

const styles = theme => ({
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
            backgroundColor: '#eeeeee',
        },
        text: 'italic',
    },
    icon: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        color: '#757575',
    },
});

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const Add = ({classes, connErr, collections}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

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
            CollectionsActions.addCollection(form.name, (err) => setState({...state, serverError: err}));

            if(!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    return (
        <React.Fragment>
            {/* <Button className={classes.button} variant="contained" onClick={handleClickOpen}>
                <AddBoxIcon />
                {'Add'}
            </Button> */}
            <ButtonBase className={classes.buttonBase} onClick={handleClickOpen} >
                <AddBoxIcon className={classes.icon}/>
            </ButtonBase>
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
    /* styles properties */
    classes: PropTypes.object.isRequired,

    /* application properties */
    connErr: ApplicationStore.types.connErr.isRequired,
    /* collections properties */
    collections: CollectionsStore.types.collections.isRequired,
};

export default withStyles(styles)(withStores(Add));