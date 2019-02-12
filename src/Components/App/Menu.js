import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: [],
});

class Menu extends React.Component {
    handleClickLogout = () => {
        ApplicationActions.disconnect();
    }

    handleClickNavigate = (path) => () => {
        ApplicationActions.navigate({path});
    }

    render() {
        return (
            <React.Fragment>
                <List>
                    <ListItem button onClick={this.handleClickNavigate('collections')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Collections" />
                    </ListItem>
                    <ListItem button onClick={this.handleClickNavigate('nodes')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Nodes" />
                    </ListItem>
                    <ListItem button onClick={this.handleClickNavigate('users')}>
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
                        <ListItemText primary="Logout" onClick={this.handleClickLogout} />
                    </ListItem>
                </List>
            </React.Fragment>
        );
    }
}

export default withStores(Menu);