import makeStyles from '@mui/styles/makeStyles';
import {Link as RouterLink} from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import {EDITOR_ROUTE} from '../../Constants/Routes';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

const QueryEditorMenu = () => {
    const classes = useStyles();

    return (
        <List className={classes.root} dense disablePadding>
            <ListItem
                button
                component={RouterLink}
                to={location => ({...location, pathname: `/${EDITOR_ROUTE}`})}
            >
                <ListItemIcon>
                    <CodeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="EDITOR" />
            </ListItem>
        </List>
    );
};

export default QueryEditorMenu;
