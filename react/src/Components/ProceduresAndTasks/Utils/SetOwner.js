import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ThingsdbActions, ThingsdbStore } from '../../../Stores';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const SetOwner = ({init, onChange, users}) => {
    const [owner, setOwner] = React.useState('');

    React.useEffect(() => {
        ThingsdbActions.getUsers();
        setOwner(init);
    }, [init]);

    const handleChangeOwner = ({target}) => {
        const {value} = target;
        setOwner(value);
        onChange(value);
    };

    return (
        <TextField
            autoFocus
            fullWidth
            label="Owner"
            margin="dense"
            name="owner"
            onChange={handleChangeOwner}
            select
            SelectProps={{native: true}}
            value={owner}
            variant="standard"
        >
            {users.map((u) => (
                <option key={u.name} value={u.name}>
                    {u.name}
                </option>
            ))}
        </TextField>
    );
};

SetOwner.propTypes = {
    init: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,

    /* thingsdb properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(SetOwner);
