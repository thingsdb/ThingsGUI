import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import {withVlow} from 'vlow';

import {Add} from '../Users/Config';
import {Menu, orderByName} from '../Util';
import {ThingsdbActions, ThingsdbStore} from '../../Stores';
import {USER_ROUTE} from '../../Constants/Routes';
import {isObjectEmpty} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user', 'users']
}]);


const UsersMenu = ({user, users}) => {

    const handleRefresh = () => {
        ThingsdbActions.getUser();
        ThingsdbActions.getUsers();
    };

    const users2 =
    users.length ? users
        : isObjectEmpty(user) ? []
            : [user];


    const orderedUsers = orderByName(users2);

    return (
        <Menu
            addItem={<Add />}
            homeRoute={USER_ROUTE}
            icon={<PersonIcon color="primary" />}
            itemKey="name"
            items={orderedUsers}
            onRefresh={handleRefresh}
            title="users"
        />
    );
};

UsersMenu.propTypes = {

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(UsersMenu);