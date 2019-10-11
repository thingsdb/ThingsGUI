import React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import {ApplicationActions} from '../../Stores/ApplicationStore';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    nestedAdd: {
        padding: 0,
    },
}));

const QueryEditorMenu = () => {
    const classes = useStyles();
    const handleClickCollection = () => {
        // ApplicationActions.openEditor();
        ApplicationActions.navigate({path: 'query', index: 0});
    };

    return (
        <List className={classes.root} dense disablePadding>
            <ListItem button onClick={handleClickCollection}>
                <ListItemIcon>
                    <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="QUERY EDITOR" />
            </ListItem>
        </List>
    );
};

export default QueryEditorMenu;
