import {Link as RouterLink} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';


const OverviewMenu = () => (
    <List dense>
        <ListItem
            button
            component={RouterLink}
            to="/"
        >
            <ListItemIcon>
                <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="OVERVIEW" />
        </ListItem>
    </List>
);

export default OverviewMenu;
