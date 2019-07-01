/* eslint-disable react/no-multi-comp */
import React from 'react';

import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import {useStore} from '../../Stores/ApplicationStore';


const Users = () => {
    const [store] = useStore();
    const {users} = store;

    const rows = users;
    const header = [{
        ky: 'name',
        label: 'User',
    }];
    const rowExtend = (row) => <User user={row} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
            <AddUser />
        </React.Fragment>
    );
};

export default Users;