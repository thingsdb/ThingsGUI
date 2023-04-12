import { useLocation, useNavigate } from 'react-router-dom';
import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { CardButton, ErrorMsg, historyNavigate, SimpleModal } from '../../Utils';
import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { RenameUserTAG } from '../../../Constants/Tags';
import { USER_ROUTE } from '../../../Constants/Routes';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

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

const tag = RenameUserTAG;

const Rename = ({user, users}) => {
    let navigate = useNavigate();
    let location = useLocation();

    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({show: true, errors: {}, form: {...user}});
    };

    const handleClickClose = () => {
        setState(state => ({...state, show: false}));
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
        setState(state => ({...state, errors: err}));
        if (!Object.values(err).some(d => Boolean(d))) {
            ThingsdbActions.renameUser(
                user.name,
                form.name,
                tag,
                () => {
                    setState(state => ({...state, show: false}));
                    historyNavigate(navigate, location, `/${USER_ROUTE}/${form.name}`);
                }
            );
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
                error={Boolean(errors.name)}
                fullWidth
                helperText={errors.name}
                id="name"
                label="Name"
                margin="dense"
                onChange={handleOnChange}
                spellCheck={false}
                type="text"
                value={form.name}
                variant="standard"
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Rename" />
            }
            title="Rename user"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Rename.propTypes = {
    user: PropTypes.object.isRequired,

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Rename);