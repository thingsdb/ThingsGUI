import { makeStyles } from '@material-ui/core/styles';
import {Link as RouterLink} from 'react-router-dom';
import CodeIcon from '@material-ui/icons/Code';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
