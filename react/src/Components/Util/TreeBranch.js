import makeStyles from '@mui/styles/makeStyles';
import BuildIcon from '@mui/icons-material/Build';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {DownloadBlob, StringDialog} from '.';
import {BYTES, STR} from '../../Constants/ThingTypes';


const useStyles = makeStyles(() => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
    text: {
        width: '80%',
    }
}));


const TreeBranch = ({canToggle, name, onAction, onClick, onOpen, onRenderChildren, type, val, inset}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [focus, setFocus] = React.useState(false);

    const renderChildren = () => {
        return onRenderChildren();
    };

    const handleClick = () => {
        setShow(!show);
        onOpen(!show);
    };

    const handleOnMouseEnter = () => {
        setFocus(true);
    };

    const handleOnMouseLeave = () => {
        setFocus(false);
    };


    return (
        <React.Fragment>
            <ListItem style={{margin: 0, paddingTop:0, paddingBottom:0, paddingRight: 0, paddingLeft: inset?32:0}} button ContainerProps={{onMouseEnter: handleOnMouseEnter, onMouseLeave: handleOnMouseLeave}} onClick={handleClick}>
                <ListItemIcon>
                    {canToggle ? show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> : null}
                </ListItemIcon>
                <ListItemText
                    classes={{ root: classes.listItem, primary: classes.text }}
                    primary={
                        <React.Fragment>
                            {name ? (
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    component="span"
                                >
                                    {`${name}   `}
                                </Typography>
                            ) : null}
                            {type === BYTES ?  '      Blob' : `     ${val}`}
                        </React.Fragment>
                    }
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true,
                    }}
                />

                <ListItemSecondaryAction>
                    <Collapse component="span" in={focus} timeout={1}>
                        {onClick && (
                            <IconButton color="primary" size="small" onClick={onClick} >
                                <BuildIcon color="primary" />
                            </IconButton>
                        )}
                        {onAction && onAction(name, type, val)}
                        {!onClick ? (
                            type === BYTES ? (
                                <DownloadBlob val={val} />
                            ) : type === STR ? (
                                <StringDialog name={name} text={val} />
                            ) : null
                        ):null}
                    </Collapse>
                </ListItemSecondaryAction>
            </ListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense style={{paddingLeft: inset?32:0}}>
                    {show&&renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

TreeBranch.defaultProps = {
    name: null,
    onAction: null,
    onClick: null,
    onOpen: () => null,
    inset: false,
};

TreeBranch.propTypes = {
    canToggle: PropTypes.bool.isRequired,
    name: PropTypes.string,
    onAction: PropTypes.func,
    onClick: PropTypes.func,
    onOpen: PropTypes.func,
    onRenderChildren: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    inset: PropTypes.bool,
};

export default TreeBranch;
