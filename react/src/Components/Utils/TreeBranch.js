import { styled } from '@mui/material/styles';
import BuildIcon from '@mui/icons-material/Build';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { DownloadBlob, StringDialog } from '.';
import { BYTES, STR } from '../../Constants/ThingTypes';

const StyledListItem = styled(ListItem, {shouldForwardProp: (prop) => prop !== 'inset'})(
    ({ inset }) => ({
        margin: 0,
        paddingTop:0,
        paddingBottom:0,
        paddingRight: 0,
        paddingLeft: inset ? 32 : 0,
        '& .MuiListItemButton-root': {
            margin: '0px',
            padding: '0px',
            width: '100%'
        },
        '& .MuiListItemText-root': {
            margin: '0px',
            padding: '0px',
        },
        '& .MuiListItemText-primary': {
            width: '80%',
        }
    })
);

const StyledList = styled(List, {shouldForwardProp: (prop) => prop !== 'inset'})(
    ({ inset }) => ({
        paddingLeft: inset ? 32 : 0,
    })
);

const TreeBranch = ({canToggle, name, onAction, onClick, onOpen, onRenderChildren, type, val, inset}) => {
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
            <StyledListItem inset={inset} ContainerProps={{onMouseEnter: handleOnMouseEnter, onMouseLeave: handleOnMouseLeave}}>
                <ListItemButton onClick={handleClick} disableTouchRipple={!canToggle}>
                    <ListItemIcon>
                        {canToggle ? show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> : null}
                    </ListItemIcon>
                    <ListItemText
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
                </ListItemButton>
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
            </StyledListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <StyledList inset={inset} component="div" disablePadding dense>
                    {show&&renderChildren()}
                </StyledList>
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
