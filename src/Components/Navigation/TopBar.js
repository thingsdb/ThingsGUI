import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
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

import {makeStyles} from '@material-ui/core/styles';

import ApplicationActions from '../../Actions/ApplicationActions';
// import packageJson from '../../'; TODO does not find package.json

const applicationActions = new ApplicationActions();


const useStyles = makeStyles(theme => ({
    avatar: {
        // width: 35,
        height: 35,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        minWidth: 1200,
    },
    flex: {
        flexGrow: 1,
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
}));


const TopBar = ({children}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const user = useGlobal('user')[0];

    const handleClickLogout = () => {
        applicationActions.disconnect();
    };

    const handleMenuOpen = ({currentTarget}) => {
        setAnchorEl(currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const isOpen = Boolean(anchorEl);

    return (
        <React.Fragment>
            <AppBar
                className={classes.appBar}
                position="static"
            >
                <Toolbar className={classes.toolbar}>
                    <div className={classes.flex}>
                        {/* <Tooltip disableFocusListener disableTouchListener title={packageJson.version}>                   */}
                        <img
                            alt="ThingsDB Logo"
                            src="/static/img/thingsdb-logo.png"
                            className={classes.avatar}
                            draggable='false'
                        />
                        {/* </Tooltip> */}
                    </div>
                    <div>
                        <Tooltip disableFocusListener disableTouchListener title="User menu">
                            <div className={classes.flex}>
                                <IconButton
                                    aria-haspopup="true"
                                    aria-owns={isOpen ? 'menu-appbar' : null}
                                    color="inherit"
                                    onClick={handleMenuOpen}
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
                            onClose={handleMenuClose}
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
                                    <ListItemText primary="Logout" onClick={handleClickLogout} />
                                </ListItem>
                            </List>
                        </Menu>
                    </div>
                    {children}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

TopBar.propTypes = {
    children: PropTypes.object.isRequired,
};

export default TopBar;
