import React from 'react';
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import Toolbar from '@material-ui/core/Toolbar';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import {TopBarMenu} from '../Util';
import {ApplicationActions, ThingsdbStore} from '../../Stores';
// import packageJson from '../../'; TODO does not find package.json

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user']
}]);


const useStyles = makeStyles(theme => ({
    avatar: {
        height: 35,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        marginBottom: theme.spacing(1),
    },
    flex: {
        display: 'flex',
    },
    flexGrow: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: 48,
    },
}));


const TopBar = ({additionals, menuIcon, pageIcon, user, title}) => {
    const classes = useStyles();
    const handleClickLogout = () => {
        ApplicationActions.disconnect();
    };

    return (
        <AppBar
            className={classes.appBar}
            position="static"
        >
            <Toolbar className={classes.toolbar}>
                {menuIcon &&
                    <div className={classes.flexGrow}>
                        {menuIcon}
                    </div>
                }
                {pageIcon &&
                    <div className={classes.flexGrow}>
                        {pageIcon}
                    </div>
                }
                {title &&
                    <div className={classes.flexGrow}>
                        {title}
                    </div>
                }
                <div >
                    <TopBarMenu menuIcon={<AccountCircle />} menuTooltip="Logout">
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary={user.name} />
                            </ListItem>
                            <ListItem button onClick={handleClickLogout}>
                                <ListItemIcon>
                                    <ExitToAppIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </TopBarMenu>
                </div>
                <div>
                    {additionals}
                </div>
            </Toolbar>
        </AppBar>
    );
};

TopBar.defaultProps = {
    additionals: null,
    menuIcon: null,
    title: null,
};

TopBar.propTypes = {
    additionals: PropTypes.object,
    menuIcon: PropTypes.object,
    pageIcon: PropTypes.object.isRequired,
    title: PropTypes.object,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
};

export default withStores(TopBar);