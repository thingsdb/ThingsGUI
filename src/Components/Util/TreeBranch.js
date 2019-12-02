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


const TreeBranch = ({children, name, type, val, canToggle, onRenderChildren, onClick, button, onAction}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const renderChildren = () => {
        return onRenderChildren();
    };

    const handleClick = () => {
        setShow(!show);
        onClick();
    };

    const handleOpenStringDialog = () => {
        setOpen(true);
    };

    const handleCloseStringDialog = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ListItem className={classes.listItem} button={button?true:false} onClick={onAction}>
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
                        {canToggle ? (
                            <ButtonBase onClick={handleClick} >
                                {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                            </ButtonBase>
                        ) : null}
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
                        ):null
                        }
                    </React.Fragment>
                </ListItemSecondaryAction>
            </ListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

TreeBranch.defaultProps = {
    children: null,
    name: null,
    button: false,
    onClick: () => null,
    onAction: () => null,
};

TreeBranch.propTypes = {
    children: PropTypes.object,
    button: PropTypes.bool,
    onAction: PropTypes.func,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    canToggle: PropTypes.bool.isRequired,
    onRenderChildren: PropTypes.func.isRequired,
    onClick: PropTypes.func,
};

export default TreeBranch;
