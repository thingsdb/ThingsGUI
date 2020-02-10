/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import OpenIcon from '@material-ui/icons/OpenInNewOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import {DownloadBlob, SimpleModal, TreeIcon} from '../Util';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
    text: {
        width: '80%',
    }
}));


const TreeBranch = ({button, canToggle, children, name, onAction, onClick, onOpen, onRenderChildren, type, val}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const renderChildren = () => {
        return onRenderChildren();
    };

    const handleClick = () => {
        setShow(!show);
        onOpen(!show);
    };

    const handleOpenStringDialog = () => {
        setOpen(true);
    };

    const handleCloseStringDialog = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ListItem className={classes.listItem} button={button?true:false} onClick={onClick}>
                <ListItemIcon>
                    <TreeIcon type={type} />
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
                            {type === 'bytes' ?  '   :   Blob' : `   :  ${val}`}
                        </React.Fragment>
                    }
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true,
                    }}
                />
                {children}
                <ListItemSecondaryAction>
                    <React.Fragment>
                        {onAction&&onAction(name, type, val)}
                        {canToggle&& (
                            <ButtonBase onClick={handleClick} >
                                {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                            </ButtonBase>
                        )}
                        {!button ? (
                            type === 'bytes' ? (
                                <DownloadBlob val={val} isFab={false} />
                            ) : type === 'str' ? (
                                <SimpleModal
                                    button={
                                        <ButtonBase onClick={handleOpenStringDialog} >
                                            <OpenIcon color="primary" />
                                        </ButtonBase>
                                    }
                                    title="Show string"
                                    open={open}
                                    onClose={handleCloseStringDialog}
                                >
                                    <Typography align="justify" variant="body2">
                                        {val}
                                    </Typography>
                                </SimpleModal>
                            ) : null
                        ):null}
                    </React.Fragment>
                </ListItemSecondaryAction>
            </ListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {show&&renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

TreeBranch.defaultProps = {
    button: false,
    children: null,
    name: null,
    onAction: null,
    onClick: () => null,
    onOpen: () => null,
};

TreeBranch.propTypes = {
    button: PropTypes.bool,
    canToggle: PropTypes.bool.isRequired,
    children: PropTypes.object,
    name: PropTypes.string,
    onAction: PropTypes.func,
    onClick: PropTypes.func,
    onOpen: PropTypes.func,
    onRenderChildren: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
};

export default TreeBranch;
