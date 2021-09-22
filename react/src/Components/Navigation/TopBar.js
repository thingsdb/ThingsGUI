import makeStyles from '@mui/styles/makeStyles';
import {withVlow} from 'vlow';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import {THINGS_DOC} from '../../Constants/Links';
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
    color: {
        color: theme.palette.text.primary
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
                <div>
                    <Tooltip disableFocusListener disableTouchListener title="Go to ThingsDocs">
                        <IconButton target="_blank" href={THINGS_DOC} edge="start" className={classes.color} aria-label="close">
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div>
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