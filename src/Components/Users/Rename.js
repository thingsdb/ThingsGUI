import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import { ErrorMsg } from '../Util';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';

const useStyles = makeStyles(theme => ({
    card: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        margin: theme.spacing(1),
    },
    wrapper: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        padding: theme.spacing(2),
    },
}));

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const Rename = ({user, users}) => {
    const classes = useStyles();
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
            ThingsdbActions.renameUser(
                user.name, 
                form.name, 
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }

    return (
        <React.Fragment>
            <Card
                className={classes.card}
                raised
            >
                <CardActionArea
                    focusRipple
                    className={classes.wrapper}
                    onClick={handleClickOpen}
                >
                    <CardContent>
                        <Typography variant={'h6'} >
                            {'Rename'}
                        </Typography> 
                    </CardContent>
                </CardActionArea>
            </Card>
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
                    <ErrorMsg error={serverError} onClose={handleCloseError} />
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
    users: ThingsdbStore.types.users.isRequired,    
};

export default withStores(Rename);