import React, {useState} from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import {ApplicationActions} from '../../Stores/ApplicationStore';


const Menu = () => {

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
        </React.Fragment>
    );
};

export default Menu;