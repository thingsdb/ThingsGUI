import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {ApplicationActions} from '../../Stores/ApplicationStore';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
});


const UsersMenu = ({classes}) => {

    const handleClickUsers = () => {
        ApplicationActions.navigate({path: 'users'});
    };

    return (
        <React.Fragment>
            <List className={classes.root}>
                <ListItem button onClick={handleClickUsers}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="USERS" />
                </ListItem>
            </List>
        </React.Fragment>
    );
};

UsersMenu.propTypes = {
    /* styles properties */
    classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(UsersMenu);
