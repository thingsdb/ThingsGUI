import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import PropTypes from 'prop-types';
import PersonIcon from '@material-ui/icons/Person';

import AddUser from '../Users/Add';
import {Menu} from '../Util';
import ApplicationActions from '../../Actions/ApplicationActions';



const UsersMenu = ({onClickUser}) => {
    const users = useGlobal('users')[0];

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
    onClickUser: PropTypes.func.isRequired,

};

export default UsersMenu;
