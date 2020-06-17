import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import {withVlow} from 'vlow';

import {Add} from '../Users/Config';
import {Menu, orderByName} from '../Util';
import {ApplicationActions, ThingsdbActions, ThingsdbStore} from '../../Stores';
import {isObjectEmpty} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user', 'users']
}]);


const UsersMenu = ({user, users}) => {
    React.useEffect(() => {
        ThingsdbActions.getUser();
        setTimeout(()=>ThingsdbActions.getUsers(), 1000);
    }, []);

    const handleRefresh = () => {
        ThingsdbActions.getUser();
        ThingsdbActions.getUsers();
    };

    const handleClickUser = (user) => {
        ApplicationActions.navigate({path: 'user', index: user, item: '', scope: ''});
    };

    const users2 =
    users.length ? users
        : isObjectEmpty(user) ? []
            : [user];


    const orderedUsers = orderByName(users2);

    return (
        <Menu
            title="users"
            icon={<PersonIcon color="primary" />}
            items={orderedUsers}
            addItem={<Add />}
            onClickItem={handleClickUser}
            onRefresh={handleRefresh}
        />
    );
};

UsersMenu.propTypes = {

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(UsersMenu);