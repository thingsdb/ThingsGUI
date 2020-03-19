import { makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';

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


const Menu = ({title, icon, items, addItem, onClickItem, onRefresh}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
        onRefresh&&onRefresh();
    };
    const handleClickItem = (i) => () => {
        onClickItem(i);
    };

    return (
        <List className={classes.root} dense disablePadding>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    {open ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                </ListItemIcon>
                <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true,
                    }}
                />
                {onRefresh && (
                    <ListItemSecondaryAction>
                        <Tooltip disableFocusListener disableTouchListener title={`Refresh ${title.toLowerCase()} info`}>
                            <Button onClick={onRefresh}>
                                <RefreshIcon color="primary" />
                            </Button>
                        </Tooltip>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.length ? items.map((item, i) => (
                        <ListItem key={i} button className={classes.nested} onClick={handleClickItem(i)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                primaryTypographyProps={{
                                    display: 'block',
                                    noWrap: true,
                                }}
                            />
                        </ListItem>
                    )) : (
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
    );
};

Menu.defaultProps = {
    onRefresh: null,
};

Menu.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    icon: PropTypes.element.isRequired,
    addItem: PropTypes.object.isRequired,
    onClickItem: PropTypes.func.isRequired,
    onRefresh: PropTypes.func,

};

export default Menu;
