import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import {withVlow} from 'vlow';

import AddUser from '../Users/Add';
import {Menu} from '../Util';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';
import {isObjectEmpty} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user', 'users']
}]);


const UsersMenu = ({user, users}) => {
    React.useEffect(() => {
        ThingsdbActions.getUsers();
        ThingsdbActions.getUser();
        const setPoll = setInterval(
            () => {
                ThingsdbActions.getUser();
                if (user.access.privileges.includes('GRANT')||user.access.privileges.includes('FULL')) {
                    ThingsdbActions.getUsers();
                }
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
            icon={<PersonIcon />}
            items={users2}
            addItem={<AddUser />}
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
