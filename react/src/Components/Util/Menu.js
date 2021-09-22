import {Link as RouterLink} from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';


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
    ListItemSecondaryAction: {
        right: '0px',
    },
}));


const Menu = ({addItem, homeRoute, icon, itemKey, items, onRefresh, title}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
        onRefresh&&!open&&onRefresh();
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
                        variant: 'button'
                    }}
                />
                {onRefresh && open && (
                    <ListItemSecondaryAction className={classes.ListItemSecondaryAction}>
                        <Tooltip disableFocusListener disableTouchListener title={`Refresh ${title.toLowerCase()} info`}>
                            <Button color="primary" onClick={onRefresh}>
                                <RefreshIcon color="primary" />
                            </Button>
                        </Tooltip>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.length ? items.map((item, i) => (
                        <ListItem
                            key={i}
                            button
                            className={classes.nested}
                            component={RouterLink}
                            to={location => ({...location, pathname: `/${homeRoute}/${item[itemKey]}`})}
                        >
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item[itemKey]}
                                primaryTypographyProps={{
                                    display: 'block',
                                    noWrap: true,
                                }}
                            />
                        </ListItem>
                    )) : (
                        <ListItem button className={classes.nested}>
                            <Box fontSize={12} fontStyle="italic" m={1}>
                                {`No ${title}`}
                            </Box>
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
    addItem: PropTypes.object.isRequired,
    homeRoute: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    itemKey: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRefresh: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default Menu;
