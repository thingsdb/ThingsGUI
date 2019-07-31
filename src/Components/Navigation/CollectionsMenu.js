import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AddCollection from '../Collections/Add';
import {ApplicationActions} from '../../Stores/ApplicationStore';



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
    iconMenu: {
        backgroundColor: theme.palette.background.paper,
    },
});


const CollectionsMenu = ({classes, collections, onClickCollection}) => {
    const [open, setOpen] = React.useState(true);
    
    const handleClickCollections = () => {
        setOpen(!open);
    };
    const handleClickCollection = (collection) => () => {
        onClickCollection(collection);
        ApplicationActions.navigate({path: 'collections'});
    } 

    return (
        <React.Fragment>
            <List className={classes.root}>
                <ListItem button onClick={handleClickCollections}>
                    <ListItemIcon>
                        {open ? <ExpandMore /> : <ChevronRightIcon />}
                    </ListItemIcon>
                    <ListItemText primary="COLLECTIONS" />
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {collections.length && collections.map((collection, i) => {
                            return(
                                <ListItem key={i} button className={classes.nested} onClick={handleClickCollection(i)}>
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
            </List>
        </React.Fragment>
    );
};

CollectionsMenu.propTypes = {
    onClickCollection: PropTypes.func.isRequired,
    collections: PropTypes.array.isRequired,

    /* styles properties */
    classes: PropTypes.object.isRequired,
    
};

export default withStyles(styles)(CollectionsMenu);
