import {Link as RouterLink} from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';


const OverviewMenu = () => (
    <List dense>
        <ListItemButton
            component={RouterLink}
            to="/"
        >
            <ListItemIcon>
                <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="OVERVIEW" />
        </ListItemButton>
    </List>
);

export default OverviewMenu;
