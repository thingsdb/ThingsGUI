import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';


const useStyles = makeStyles(() => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    collapse: {
        width: '100%'
    },
}));


const LocalMsg = ({icon, title, body, onClose}) => {
    const classes = useStyles();

    const handleCloseError = () => {
        onClose();
    };

    return (
        <Collapse className={classes.collapse} in={Boolean(body)} timeout="auto" unmountOnExit>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                            {icon}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={title}
                        secondary={body}
                        primaryTypographyProps={{
                            variant: 'caption'
                        }}
                    />
                    {onClose && (
                        <ListItemSecondaryAction>
                            <IconButton color="primary" onClick={handleCloseError}>
                                <CloseIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            </List>
        </Collapse>
    );
};

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