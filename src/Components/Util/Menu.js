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
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    nestedAdd: {
        padding: 0,
    },
}));


const Menu = ({title, icon, items, addItem, onClickItem}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
    };
    const handleClickItem = (i) => () => {
        onClickItem(i);
    };

    return (
        <React.Fragment>
            <List className={classes.root} dense disablePadding>
                <ListItem button onClick={handleClickOpen}>
                    <ListItemIcon>
                        {open ? <ExpandMore /> : <ChevronRightIcon />}
                    </ListItemIcon>
                    <ListItemText primary={title} />
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {items.length ? items.map((item, i) => {
                            return(
                                <ListItem key={i} button className={classes.nested} onClick={handleClickItem(i)}>
                                    <ListItemIcon>
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            );
                        }) : (
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <BlockIcon />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{'variant':'caption', 'color':'error'}} />
                            </ListItem>
                        )}
                        <Divider />
                        <ListItem className={classes.nestedAdd} >
                            {addItem}
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </React.Fragment>
    );
};

Menu.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    icon: PropTypes.element.isRequired,
    addItem: PropTypes.object.isRequired,
    onClickItem: PropTypes.func.isRequired,

};

export default Menu;
