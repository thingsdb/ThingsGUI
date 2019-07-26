import React, {useState} from 'react';
import Collapse from '@material-ui/core/Collapse';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import AddCollection from '../Collections/Add';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionsStore} from '../../Stores/CollectionsStore';


const withStores = withVlow([{
    store: CollectionsStore,
    keys: ['collections']
}]);


const styles = theme => ({
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
});

const Menu = ({classes, collections, onClickCollection}) => {
    const [open, setOpen] = useState(true);

    const handleClickCollections = () => {
        setOpen(!open);
    };
    const handleClickCollection = (collection) => () => {
        onClickCollection(collection);
        ApplicationActions.navigate({path: 'collections'});
    } 

    const handleClickNodes = () => {
        ApplicationActions.navigate({path: 'nodes'});
    };

    const handleClickUsers = () => {
        ApplicationActions.navigate({path: 'users'});
    };

    return (
        <React.Fragment>
            <List className={classes.root}>
                <ListItem button onClick={handleClickCollections}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Collections" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {collections.length && collections.map((collection, i) => {
                            return(
                                <ListItem key={i} button className={classes.nested} onClick={handleClickCollection(collection)}>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={collection.name} />
                                </ListItem>
                            );
                        })}   
                        <Divider />
                        <ListItem className={classes.nestedAdd} >
                            <AddCollection />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={handleClickNodes}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Nodes" />
                </ListItem>
                <ListItem button onClick={handleClickUsers}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
            </List>
        </React.Fragment>
    );
};

Menu.propTypes = {
    onClickCollection: PropTypes.func.isRequired,

    /* styles properties */
    classes: PropTypes.object.isRequired,
    /* Collections properties */
    collections: CollectionsStore.types.collections.isRequired,
};

export default withStyles(styles)(withStores(Menu));