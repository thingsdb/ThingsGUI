/*eslint-disable react/no-multi-comp*/
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React from 'react';

const Err = ({icon, title, body, onClose}) => (
    <List>
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{backgroundColor: 'transparent'}}>
                    {icon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={body}
                primaryTypographyProps={{
                    variant: 'caption',
                    color: 'primary'
                }}
            />
            {onClose && (
                <ListItemSecondaryAction>
                    <IconButton color="primary" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    </List>
);

Err.defaultProps = {
    body: '',
    icon: null,
    onClose: null,
    title: '',
};

Err.propTypes = {
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const LocalMsg = ({icon, title, body, onClose, useAsPopUp}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        onClose && onClose();
    };

    const open = Boolean(anchorEl);

    return(useAsPopUp ? (
        <div>
            <IconButton onClick={handlePopoverOpen}>
                {icon}
            </IconButton>
            <Popover
                id="popover"
                sx={{zIndex: 1500}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Err icon={icon} title={title} body={body} onClose={handlePopoverClose} />
            </Popover>
        </div>
    ) : (
        <Collapse in={Boolean(body)} timeout="auto" unmountOnExit sx={{width: '100%'}}>
            <Err icon={icon} title={title} body={body} onClose={onClose} />
        </Collapse>
    ));
};

LocalMsg.defaultProps = {
    body: '',
    icon: null,
    onClose: null,
    title: '',
    useAsPopUp: false,
};

LocalMsg.propTypes = {
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    useAsPopUp: PropTypes.bool,
};

export default LocalMsg;