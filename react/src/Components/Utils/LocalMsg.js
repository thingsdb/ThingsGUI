import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';


const LocalMsg = ({icon, title, body, onClose}) => (
    <Collapse in={Boolean(body)} timeout="auto" unmountOnExit sx={{width: '100%'}}>
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
    </Collapse>
);

LocalMsg.defaultProps = {
    title: '',
    body: '',
    onClose: null,
    icon: null
};

LocalMsg.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClose: PropTypes.func,
    icon: PropTypes.object,
};

export default LocalMsg;