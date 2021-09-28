
import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ErrorMsg, SimpleModal } from '../../Util';
import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { AddUserTAG } from '../../../Constants/Tags';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const initialState = {
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

const Add = ({open, onClose, users}) => {
    const [state, setState] = React.useState(initialState);
    const {errors, form} = state;

    React.useEffect(() => { // clean state
        setState(initialState);
    }, [open]);

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

    return(
        <SimpleModal
            title="New User"
            open={open}
            onOk={handleClickOk}
            onClose={onClose}
            onKeyPress={handleKeyPress}
        >
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
        </SimpleModal>
    );
};

Add.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Add);