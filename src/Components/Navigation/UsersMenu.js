import React from 'react';
import PropTypes from 'prop-types';
import PersonIcon from '@material-ui/icons/Person';

import AddUser from '../Users/Add';
import {Menu} from '../Util';
import { ApplicationActions, useStore } from '../../Actions/ApplicationActions';



const UsersMenu = ({onClickUser}) => {
    const [store, dispatch] = useStore();
    const {users} = store;

    const handleClickUser = (user) => {
        onClickUser(user);
        ApplicationActions.navigate(dispatch, {path: 'user'});
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
