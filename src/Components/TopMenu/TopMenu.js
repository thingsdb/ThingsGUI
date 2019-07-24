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
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';

import {ApplicationActions} from '../../Stores/ApplicationStore';
// import packageJson from '../../'; TODO does not find package.json

const styles = {
    avatar: {
        width: 35,
        height: 28,
    },
    flexRoot: {
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
    }
};


class TopMenu extends React.Component {

    static propTypes = {

        /* Styles properties */
        classes: PropTypes.object.isRequired,
    }

    state = {
        anchorEl: null,
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

    render() {
        const {classes} = this.props;
        const {anchorEl, handleMenuExited} = this.state;
        const isOpen = Boolean(anchorEl);

        return (
            <AppBar
                className={classes.flexRoot}
                position="static"
            >
                <Toolbar className={classes.toolbar}>
                    <div className={classes.flex} >
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
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        {'ThingsDB'}
                    </Typography>
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
                                <ListItem button>
                                    <ListItemIcon>
                                        <ExitToAppIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" onClick={this.handleClickLogout} />
                                </ListItem>
                            </List>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(TopMenu);
