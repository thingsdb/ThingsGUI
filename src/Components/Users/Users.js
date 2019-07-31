/* eslint-disable react/no-multi-comp */
import React from 'react';
import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import {withVlow} from 'vlow';

import {UsersStore} from '../../Stores/UsersStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: UsersStore,
    keys: ['users']
}]);


const Users = ({users}) => {

    const rows = users;
    const header = [{
        ky: 'name',
        label: 'USER',
    }];
    const rowExtend = (row) => <User user={row} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
            <AddUser />
        </React.Fragment>
    );
};

Users.propTypes = {

    /* application properties */
    users: UsersStore.types.users.isRequired,    
};

export default withStores(Users);