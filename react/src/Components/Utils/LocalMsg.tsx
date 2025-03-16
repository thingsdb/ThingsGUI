/*eslint-disable react/no-multi-comp*/
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React from 'react';

const Err = ({
    icon = null,
    title = '',
    body = '',
    onClose = null
}: ErrProps) => (
    <List>
        <ListItem
            secondaryAction={onClose ? (
                <IconButton color="primary" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : undefined}
        >
            <ListItemAvatar>
                <Avatar sx={{backgroundColor: 'transparent'}}>
                    {icon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={body}
                slotProps={{primary: {
                    variant: 'caption',
                    color: 'primary'
                }}}
            />
        </ListItem>
    </List>
);

Err.propTypes = {
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const LocalMsg = ({
    icon = null,
    title = '',
    body = '',
    onClose = null,
    useAsPopUp = false,
}: Props) => {
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

LocalMsg.propTypes = {
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.object,
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    useAsPopUp: PropTypes.bool,
};

export default LocalMsg;

interface Props {
    body: React.ReactNode;
    icon: React.ReactElement;
    onClose: () => void;
    title?: React.ReactNode;
    useAsPopUp?: boolean;
}
interface ErrProps {
    body: React.ReactNode;
    icon: React.ReactElement;
    onClose: () => void;
    title?: React.ReactNode;
}