/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import OpenIcon from '@material-ui/icons/OpenInNewOutlined';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import {SimpleModal, TreeIcon} from '../Util';
import {CollectionActions} from '../../Stores/CollectionStore';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const TreeBranch = ({children, name, type, val, canToggle, onRenderChildren, onClick}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [link, setLink] = React.useState('');

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

    const handleLink = (link) => {
        setLink(link);
    };

    const handleDownload = () => {
        CollectionActions.download(val, handleLink);
    };

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemIcon>
                    <TreeIcon type={type} />
                </ListItemIcon>
                <ListItemText
                    className={classes.listItem}
                    primary={name ? (
                        <React.Fragment>
                            <Typography
                                variant="body1"
                                color="primary"
                                component="span"
                            >
                                {`${name}   `}
                            </Typography>
                            {val.includes('http') ?  link ? (
                                <Link href={link} download="blob" type="application/octet-stream">
                                    {val}
                                </Link>
                            ) : (
                                '   -   Blob'
                            ) : `  -   ${val}`}
                        </React.Fragment>
                    ) : val}
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true
                    }}
                />
                {children}
                <ListItemIcon>
                    <React.Fragment>
                        {canToggle ? (
                            <ButtonBase onClick={handleClick} >
                                {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                            </ButtonBase>
                        ) : null}
                        {type === 'string' ? val.includes('http') ? (
                            <ButtonBase onClick={handleDownload} >
                                <DownloadIcon color="primary" />
                            </ButtonBase>
                        ) : (
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
                        ) : null}
                    </React.Fragment>
                </ListItemIcon>
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
    onClick: () => null,
};

TreeBranch.propTypes = {
    children: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    canToggle: PropTypes.bool.isRequired,
    onRenderChildren: PropTypes.func.isRequired,
    onClick: PropTypes.func,
};

export default TreeBranch;
