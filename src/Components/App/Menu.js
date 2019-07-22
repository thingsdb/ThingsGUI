import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import {ApplicationActions} from '../../Stores/ApplicationStore';

const Menu = () => {
    const handleClickLogout = () => {
        ApplicationActions.disconnect();
    };

    const handleClickCollections = () => {
        ApplicationActions.navigate({path: 'collections'});
    };

    const handleClickNodes = () => {
        ApplicationActions.navigate({path: 'nodes'});
    };

    const handleClickUsers = () => {
        ApplicationActions.navigate({path: 'users'});
    };

    return (
        <React.Fragment>
            <List>
                <ListItem button onClick={handleClickCollections}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Collections" />
                </ListItem>
                <ListItem button onClick={handleClickNodes}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Nodes" />
                </ListItem>
                <ListItem button onClick={handleClickUsers}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
            </List>
            <Divider />
            <List>
                {/* <ListSubheader inset>
                    {'Submenu'}
                </ListSubheader> */}
                <ListItem button>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" onClick={handleClickLogout} />
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default Menu;