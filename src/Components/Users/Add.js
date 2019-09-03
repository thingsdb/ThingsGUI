import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import { ErrorMsg, SimpleModal } from '../Util';
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

    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
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
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase className={classes.buttonBase} onClick={handleClickOpen} >
                    <AddBoxIcon className={classes.icon} />
                </ButtonBase>
            }
            title="New User"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

AddUser.propTypes = {

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(AddUser);