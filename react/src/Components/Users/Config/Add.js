
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

const validation = (name, users) => {
    if (name.length === 0) {
        return 'is required';
    }
    if (users.some((u) => u.name === name)) {
        return 'username is already in use';
    }
    return '';
};

const tag = AddUserTAG;

const Add = ({open, onClose, users}) => {
    const [name, setName] = React.useState('');
    const [err, setErr] = React.useState('');

    React.useEffect(() => { // clean state
        if(open) {
            setName('');
            setErr('');
        }
    }, [open]);

    const handleOnChange = ({target}) => {
        const {value} = target;
        setName(value);
        setErr('');
    };

    const handleClickOk = () => {
        const e = validation(name, users);
        setErr(e);
        if (!e) {
            ThingsdbActions.addUser(name, tag, onClose);
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
                error={Boolean(err)}
                fullWidth
                helperText={err}
                id="name"
                label="Name"
                margin="dense"
                onChange={handleOnChange}
                spellCheck={false}
                type="text"
                value={name}
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