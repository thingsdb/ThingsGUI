/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import ServerError from '../Util/ServerError';


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
    users: PropTypes.array.isRequired,
};

export default Users;