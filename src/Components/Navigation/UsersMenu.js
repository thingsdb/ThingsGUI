import React from 'react';
import PropTypes from 'prop-types';
import PersonIcon from '@material-ui/icons/Person';

import AddUser from '../Users/Add';
import {Menu} from '../Util';
import {ApplicationActions} from '../../Stores/ApplicationStore';


const UsersMenu = ({users, onClickUser}) => {

    const handleClickUser = (user) => {
        onClickUser(user);
        ApplicationActions.navigate({path: 'user'});
    };

    return (
        <Menu
            title="USERS"
            icon={<PersonIcon />}
            items={users}
            addItem={<AddUser />}
            onClickItem={handleClickUser}
        />
    );
};

UsersMenu.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClickUser: PropTypes.func.isRequired,

};

export default UsersMenu;
