import { Link as RouterLink, createSearchParams, useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';


const Menu = ({onAdd, homeRoute, icon, itemKey, items, onRefresh, title}) => {
    let [searchParams] = useSearchParams();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
        onRefresh && !open && onRefresh();
    };

    return (
        <List dense>
            <ListItem disableGutters>
                <ListItemButton onClick={handleClickOpen}>
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
                </ListItemButton>
                {onRefresh && open && (
                    <ListItemSecondaryAction>
                        <Tooltip disableFocusListener disableTouchListener title={`Refresh ${title.toLowerCase()} info`}>
                            <Button color="primary" onClick={onRefresh}>
                                <RefreshIcon color="primary" />
                            </Button>
                        </Tooltip>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List dense>
                    {items.length ? items.map((item, i) => (
                        <ListItem disableGutters key={i}>
                            <ListItemButton
                                component={RouterLink}
                                to={{
                                    pathname: `/${homeRoute}/${item[itemKey]}`,
                                    search: searchParams.has('drawer') ? createSearchParams({drawer: searchParams.get('drawer')}).toString() : ''
                                }}
                                sx={{ pl: 4 }}
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
                            </ListItemButton>
                        </ListItem>
                    )) : (
                        <ListItem>
                            <Box sx={{fontSize: 12, fontStyle: 'italic', m: 1}}>
                                {`No ${title}`}
                            </Box>
                        </ListItem>
                    )}
                    <Divider />
                    <ListItem disableGutters>
                        <ListItemButton onClick={onAdd} sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <AddBoxIcon color="primary" />
                            </ListItemIcon>
                        </ListItemButton>
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
    onAdd: PropTypes.func.isRequired,
    homeRoute: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    itemKey: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRefresh: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default Menu;
