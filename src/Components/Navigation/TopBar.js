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
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
// import packageJson from '../../'; TODO does not find package.json

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user']
}]);


const useStyles = makeStyles(theme => ({
    avatar: {
        // width: 35,
        height: 35,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        flexGrow: 1,
        marginBottom: theme.spacing(1),
        // minWidth: 1200,
    },
    flex: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: 48,
    },
}));


const TopBar = ({additionals, user}) => {
    const classes = useStyles();
    const handleClickLogout = () => {
        ApplicationActions.disconnect();
    };

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
                    <div >
                        <TopBarMenu menuIcon={<AccountCircle />}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={user.name} />
                                </ListItem>
                                <ListItem button onClick={handleClickLogout}>
                                    <ListItemIcon>
                                        <ExitToAppIcon />
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
        </React.Fragment>
    );
};

TopBar.defaultProps = {
    additionals: null,
};

TopBar.propTypes = {
    additionals: PropTypes.object,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
};

export default withStores(TopBar);
