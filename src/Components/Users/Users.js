/* eslint-disable react/no-multi-comp */
import React from 'react';

import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import {useStore} from '../../Stores/ApplicationStore';
import {useUsers, UsersActions} from '../../Stores/UsersStore';


const Users = () => {
    const [{match}] = useStore();

    const [{users}, usersDispatch] = useUsers();

    const fetch = React.useCallback(UsersActions.users(usersDispatch), [match]);
    React.useEffect(() => {
        fetch();
    }, [match]);

    const header = [{
        ky: 'name',
        label: 'User',
    }];
    const rowExtend = (row) => <User user={row} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={users} rowExtend={rowExtend} />
            <AddUser />
        </React.Fragment>
    );
};

export default Users;