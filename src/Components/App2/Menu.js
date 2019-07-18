import PropTypes from 'prop-types';
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
import {AppContext} from '../../Stores/ApplicationStore2';


const Menu = ({applicationActions}) => {

    const disconnect = useCallback(applicationActions.disconnect());
    const collections = useCallback(applicationActions.navigate({path: 'collections'}));
    const nodes = useCallback(applicationActions.navigate({path: 'nodes'}));
    const users = useCallback(applicationActions.navigate({path: 'users'}));

    const handleClickLogout = () => {
        disconnect();
    };

    const handleClickCollections = () => {
        collections();
    };

    const handleClickNodes = () => {
        nodes();
    };

    const handleClickUsers = () => {
        users();
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

Menu.propTypes = {
    applicationActions: PropTypes.object.isRequired,
};

export default () => (
    <AppContext.Consumer>
        {({store, actions}) => <Menu applicationStore={store} applicationActions={actions} />}
    </AppContext.Consumer>
);