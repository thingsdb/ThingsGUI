import React from 'react';
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {withStyles} from '@material-ui/core';

import {ApplicationActions} from '../../Stores/ApplicationStore';
import Nodes from '../Nodes/Nodes';
// import packageJson from '../../'; TODO does not find package.json

const drawerWidth = '25%';

const styles = theme => ({
    avatar: {
        width: 35,
        height: 28,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        minWidth: 1200,
    },
    appBarShift: {
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        width: `calc(100% - ${drawerWidth})`,
    },
    flex: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 2,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    toolbar: {
        minHeight: 48,
    },
    menu: {
        top: 40,
    },
    title: {
        flexGrow: 1,
        fontVariant: 'small-caps',
    },
});


class TopBar extends React.Component {

    static propTypes = {
        user: PropTypes.object.isRequired,

        /* Styles properties */
        classes: PropTypes.object.isRequired,
    }

    state = {
        anchorEl: null,
        open: false,
        handleMenuExited: () => null,
    };

    handleClickLogout = () => {
        ApplicationActions.disconnect();
    };

    handleMenuOpen = ({currentTarget}) => this.setState({
        anchorEl: currentTarget,
        handleMenuExited: () => null,
    })

    handleMenuClose = () => this.setState({anchorEl: null});

    handleDrawerOpen = () => {
        this.setState({open: true});
    }
    
    handleDrawerClose = () => {
        this.setState({open: false});
    }

    render() {
        const {classes, user} = this.props;
        const {anchorEl, open, handleMenuExited} = this.state;
        const isOpen = Boolean(anchorEl);

        return (
            <React.Fragment>
                <AppBar
                    className={open ? classes.appBarShift : classes.appBar}
                    position="static"
                >
                    <Toolbar className={classes.toolbar}>
                        <div className={classes.flex}>
                            {/* <Tooltip disableFocusListener disableTouchListener title={packageJson.version}>                   */}
                            <Avatar
                                alt="ThingsDB Logo"
                                src="/static/img/thingsdb-logo.png"
                                className={classes.avatar}
                                imgProps={{
                                    draggable:'false',
                                }}
                            />
                            {/* </Tooltip> */}
                        </div>
                        {/* <Typography variant="h5" color="inherit" className={classes.title}>
                            {'THINGSDB'}
                        </Typography> */}
                        <div>
                            <Tooltip disableFocusListener disableTouchListener title="User menu">
                                <div className={classes.flex}>
                                    <IconButton
                                        aria-haspopup="true"
                                        aria-owns={isOpen ? 'menu-appbar' : null}
                                        color="inherit"
                                        onClick={this.handleMenuOpen}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </div>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                className={classes.menu}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                onClose={this.handleMenuClose}
                                onExited={handleMenuExited}
                                open={isOpen}
                            >
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={user.name} />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" onClick={this.handleClickLogout} />
                                    </ListItem>
                                </List>
                            </Menu>
                        </div>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={this.handleDrawerOpen}
                            className={clsx(open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                        {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                        </IconButton>
                    </div>
                    <Divider />
                    <Nodes />
                </Drawer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(TopBar);
