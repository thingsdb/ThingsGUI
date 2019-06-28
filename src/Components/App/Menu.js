import React, {useCallback} from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const Menu = () => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    
    const disconnect = useCallback(AppActions.disconnect(dispatch), [dispatch]);

    const handleClickLogout = () => {
        disconnect();
    };

    const handleClickCollections = () => {
        dispatch(() => ({match: {path: 'collections'}}));
    };

    const handleClickNodes = () => {
        dispatch(() => ({match: {path: 'nodes'}}));
    };

    const handleClickUsers = () => {
        dispatch(() => ({match: {path: 'users'}}));
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