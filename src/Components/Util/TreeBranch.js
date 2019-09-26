/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import OpenIcon from '@material-ui/icons/OpenInNewOutlined';
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
    const [link, setLink] = React.useState("");

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

    const typedArrayToURL = (typedArray, mimeType) => {
        return URL.createObjectURL(new Blob([typedArray.buffer], {type: mimeType}))
    };

    // const handleDownload = () => {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('POST', '/download');
    //     xhr.setRequestHeader('Content-type', 'application/json');
    //     xhr.responseType = 'blob';

    //     xhr.onload = function (oEvent) {
    //         // var arrayBuffer = xhr.response; // Note: not oReq.responseTex
    //         var blob = new Blob([xhr.response], {type: 'text/plain'});

    //         var objectUrl = URL.createObjectURL(blob);
    //         console.log(objectUrl)
    //         // setLink(objectUrl);
    //         // window.open(objectUrl);
    //     };

    //     xhr.send((!val) ? null : JSON.stringify(val));
    //     // CollectionActions.download(val);
    // };

    const handleDownload = () => {
        var textFile = null;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/download');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'blob';

        xhr.onload = function (oEvent) {

                        // CollectionActions.download(val);
            makeTextFile = function (text) {
                var data = new Blob([text], {type: 'text/plain'});

                // If we are replacing a previously generated file we need to
                // manually revoke the object URL to avoid memory leaks.
                if (textFile !== null) {
                    window.URL.revokeObjectURL(textFile);
                }

                textFile = window.URL.createObjectURL(data);

            return textFile;
        };


        var create = document.getElementById('create'),
            textbox = document.getElementById('textbox');

        create.addEventListener('click', function () {
            var link = document.getElementById('downloadlink');
            link.href = makeTextFile(textbox.value);
            link.style.display = 'block';
        }, false);
        };

        xhr.send((!val) ? null : JSON.stringify(val));

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
                                {name}
                            </Typography>
                            {val.includes('http') ?  (
                                <React.Fragment>
                                    <button id="create" onClick={handleDownload}>Create file</button> <a download="info.txt" id="downloadlink" style="display: none">Download</a>
                                {/* <Link download="info.txt" onClick={handleDownload}>
                                    {val}
                                </Link> */}
                                </React.Fragment>
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
                        {type === 'string' ? (
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
