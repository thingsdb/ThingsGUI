import { withVlow } from 'vlow';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { THINGS_DOC } from '../../Constants/Links';
import { TopBarMenu } from '../Utils';
import { ApplicationActions, ThingsdbStore } from '../../Stores';
// import packageJson from '../../'; TODO does not find package.json


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['user']
}]);

const TopBar = ({additionals, menuIcon, pageIcon, user, title}) => {
    const handleClickLogout = () => {
        ApplicationActions.disconnect();
    };

    return (
        <AppBar
            position="static"
            sx={{backgroundColor: 'secondary.main', flexGrow: 1, marginBottom: '8px'}}
        >
            <Toolbar variant="dense">
                {menuIcon &&
                    <Box sx={{flexGrow: 1}}>
                        {menuIcon}
                    </Box>
                }
                {pageIcon &&
                    <Box sx={{flexGrow: 1}}>
                        {pageIcon}
                    </Box>
                }
                {title &&
                    <Box sx={{flexGrow: 1}}>
                        {title}
                    </Box>
                }
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Box sx={{ marginLeft: '16px' }}>
                        <Tooltip disableFocusListener disableTouchListener title="Go to Cesbit page">
                            <IconButton target="_blank" href="https://cesbit.com" edge="start" aria-label="close">
                                <img
                                    alt="cesbitWebpage"
                                    src="/img/CesbitLogo.png"
                                    draggable='false'
                                    height='24em'
                                    style={{opacity:'0.6'}}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ marginLeft: '16px' }}>
                        <Tooltip disableFocusListener disableTouchListener title="Go to GitHub repository">
                            <IconButton target="_blank" href="https://github.com/thingsdb" edge="start" aria-label="close">
                                <GitHubIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ marginLeft: '16px' }}>
                        <Tooltip disableFocusListener disableTouchListener title="Go to ThingsDocs">
                            <IconButton target="_blank" href={THINGS_DOC} edge="start" aria-label="close">
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <TopBarMenu menuIcon={<AccountCircle />} menuTooltip="Logout">
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary={user.name} />
                            </ListItem>
                            <ListItem>
                                <ListItemButton dense disableGutters onClick={handleClickLogout}>
                                    <ListItemIcon>
                                        <ExitToAppIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </TopBarMenu>
                    {additionals && (
                        <Box sx={{ marginLeft: '10px' }}>
                            {additionals}
                        </Box>
                    )}
                </Box>
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