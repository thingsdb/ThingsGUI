import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import {withVlow} from 'vlow';

import {Add} from '../Users/Config';
import {Menu} from '../Util';
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
        const setPoll = setInterval(
            () => {
                ThingsdbActions.getUser();
                ThingsdbActions.getUsers();
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);


    const handleClickUser = (user) => {
        ApplicationActions.navigate({path: 'user', index: user, item: '', scope: ''});
    };

    const users2 =
    users.length ? users
        : isObjectEmpty(user) ? []
            : [user];

    return (
        <Menu
            title="USERS"
            icon={<PersonIcon color="primary" />}
            items={users2}
            addItem={<Add />}
            onClickItem={handleClickUser}
        />
    );
};

UsersMenu.propTypes = {

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(UsersMenu);
