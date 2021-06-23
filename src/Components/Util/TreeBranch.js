import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {DownloadBlob, StringDialog, TreeIcon} from '../Util';
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


const TreeBranch = ({button, canToggle, children, name, onAction, onClick, onOpen, onRenderChildren, type, val, inset}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);

    const renderChildren = () => {
        return onRenderChildren();
    };

    const handleClick = () => {
        setShow(!show);
        onOpen(!show);
    };

    return (
        <React.Fragment>
            <ListItem style={{margin: 0, paddingTop:0, paddingBottom:0, paddingRight: 0, paddingLeft: inset?32:0}} button={button?true:false} onClick={onClick}>
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
                            {type === BYTES ?  '   :   Blob' : `   :  ${val}`}
                        </React.Fragment>
                    }
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true,
                    }}
                />
                {children}
                <ListItemSecondaryAction>
                    {onAction&&onAction(name, type, val)}
                    {canToggle&& (
                        <Button color="primary" onClick={handleClick} >
                            {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                        </Button>
                    )}
                    {!button ? (
                        type === BYTES ? (
                            <DownloadBlob val={val} />
                        ) : type === STR ? (
                            <StringDialog name={name} text={val} />
                        ) : null
                    ):null}
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
    button: false,
    children: null,
    name: null,
    onAction: null,
    onClick: () => null,
    onOpen: () => null,
    inset: false,
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
    inset: PropTypes.bool,
};

export default TreeBranch;
