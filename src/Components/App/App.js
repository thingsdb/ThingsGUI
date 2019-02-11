import BarChartIcon from '@material-ui/icons/BarChart';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Loader from './AppLoader';
import Login from './Login';
import Collections from './Collections';
import Counters from './Counters';
import Nodes from './Nodes';
import Users from './Users';
import {withVlow} from 'vlow';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'path'],
});

const styles = theme => ({
    root: {
        display: 'flex',
    },
    menu: {
        paddingTop: theme.spacing.unit * 1,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 1,
        // height: '100vh',
        // overflow: 'auto',
    },
});

class App extends React.Component {
    state = {
        selected: null,
    };

    pages = {
        collections: <Collections />,
        counters: <Counters />,
        nodes: <Nodes />,
        users: <Users />,
    };

    handleClickLogout = () => {
        ApplicationActions.disconnect();
    }

    handleClickNavigate = (path) => () => {
        ApplicationActions.navigate(path);
    }

    render() {
        const {classes, loaded, connected, path} = this.props;

        return loaded ? connected ? (
            <div className={classes.root}>
                <div className={classes.menu}>
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
                        <ListItem button onClick={this.handleClickNavigate('counters')}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Counters" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListSubheader inset>
                            {'Submenu'}
                        </ListSubheader>
                        <ListItem button>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" onClick={this.handleClickLogout} />
                        </ListItem>
                    </List>
                </div>
                <div className={classes.content}>
                    {this.pages[path]}
                </div>
            </div>
        ) : <Login /> : <Loader />;
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
    path: ApplicationStore.types.path.isRequired,
};

export default withStores(withStyles(styles)(App));