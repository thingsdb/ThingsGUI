import React from 'react';
import PropTypes from 'prop-types';
import BlockIcon from '@material-ui/icons/Block';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';

import AddUser from '../Users/Add';
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
    iconMenu: {
        backgroundColor: theme.palette.background.paper,
    },
}));


const UsersMenu = ({users, onClickUser}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClickUsers = () => {
        setOpen(!open);
    };
    const handleClickUser = (user) => () => {
        onClickUser(user);
        ApplicationActions.navigate({path: 'user'});
    };

    return (
        <React.Fragment>
            <List className={classes.root}>
                <ListItem button onClick={handleClickUsers}>
                    <ListItemIcon>
                        {open ? <ExpandMore /> : <ChevronRightIcon />}
                    </ListItemIcon>
                    <ListItemText primary="USERS" />
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {users.length ? users.map((user, i) => {
                            return(
                                <ListItem key={i} button className={classes.nested} onClick={handleClickUser(i)}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={user.name} />
                                </ListItem>
                            );
                        }) : (
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <BlockIcon />
                                </ListItemIcon>
                                <ListItemText primary="No user info visible." primaryTypographyProps={{'variant':'caption', 'color':'error'}} />
                            </ListItem>
                        )}
                        <Divider />
                        <ListItem className={classes.nestedAdd} >
                            <AddUser />
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </React.Fragment>
    );
};

UsersMenu.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClickUser: PropTypes.func.isRequired,

};

export default UsersMenu;
