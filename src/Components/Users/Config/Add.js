import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import { ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions, ThingsdbStore} from '../../../Stores';
import {AddUserTAG} from '../../../constants';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const useStyles = makeStyles(theme => ({
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
        color: theme.palette.primary.main,
    },
}));

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const validation = {
    name: (f, users) => {
        if (f.name.length==0) {
            return 'is required';
        }
        if (users.some((u) => u.name===f.name)) {
            return 'username is already in use';
        }
        return '';
    },
};

const tag = AddUserTAG;

const Add = ({users}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

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

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form, users);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            ThingsdbActions.addUser(form.name, tag, () => setState({...state, show: false}));
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
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
                error={Boolean(errors.name)}
                helperText={errors.name}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button className={classes.buttonBase} onClick={handleClickOpen} >
                    <AddBoxIcon className={classes.icon} />
                </Button>
            }
            title="New User"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Add.propTypes = {

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Add);