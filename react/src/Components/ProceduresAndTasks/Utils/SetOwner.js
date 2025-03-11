import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ThingsdbActions, ThingsdbStore } from '../../../Stores';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user', 'users']
}]);

const SetOwner = ({init, onChange, user, users}) => {
    const [owner, setOwner] = React.useState(user.name);
    let userList = users.length ? users : [user];

    React.useEffect(() => {
        ThingsdbActions.getUsers();
        if(init){
            setOwner(init);
            onChange(init);
        } else {
            onChange(user.name);
        }
    }, [init, onChange, user.name]);

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
            slotProps={{select: {native: true}}}
            value={owner}
            variant="standard"
        >
            {userList.map((u, index) => (
                <option key={`${u.name}_${index}`} value={u.name}>
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
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(SetOwner);
