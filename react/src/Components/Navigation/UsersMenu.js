import { withVlow } from 'vlow';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';

import { Add } from '../Users/Config';
import { Menu, orderByName } from '../Utils';
import { ThingsdbActions, ThingsdbStore } from '../../Stores';
import { USER_ROUTE } from '../../Constants/Routes';
import { isObjectEmpty } from '../Utils';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user', 'users']
}]);


const UsersMenu = ({user, users}) => {
    const [open, setOpen] = React.useState(false);

    const handleRefresh = () => {
        ThingsdbActions.getUser();
        ThingsdbActions.getUsers();
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const users2 =
    users.length ? users
        : isObjectEmpty(user) ? []
            : [user];


    const orderedUsers = orderByName(users2);

    return (
        <React.Fragment>
            <Menu
                homeRoute={USER_ROUTE}
                icon={<PersonIcon color="primary" />}
                itemKey="name"
                items={orderedUsers}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                title="users"
            />
            <Add open={open} onClose={handleClose} />
        </React.Fragment>
    );
};

UsersMenu.propTypes = {

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(UsersMenu);