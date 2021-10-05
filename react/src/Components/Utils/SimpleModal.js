/*eslint-disable react/jsx-props-no-spreading*/

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const SimpleModal = ({
    actionButtons,
    button,
    children,
    disableOk,
    fullWidth,
    maxWidth,
    onClose,
    onKeyPress,
    onOk,
    open,
    title,
    tooltipMsgOk,
    ...props}) => {


    const handleClose = () => {
        onClose&&onClose();
    };

    const handleOk = () => {
        onOk&&onOk();
    };

    return (
        <React.Fragment>
            {button}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth?maxWidth:'xs'}
                onKeyDown={onKeyPress}
                {...props}
            >
                {title ? (
                    <DialogTitle id="form-dialog-title">
                        {title}
                    </DialogTitle>
                ) : null}
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    {actionButtons}
                    {onOk ? (
                        <Tooltip disableFocusListener disableTouchListener title={tooltipMsgOk}>
                            <span>
                                <Button onClick={handleOk} disabled={disableOk} color="primary">
                                    {'Submit'}
                                </Button>
                            </span>
                        </Tooltip>
                    ) : null}
                    {onClose ? (
                        <Button onClick={handleClose} color="primary">
                            {'Close'}
                        </Button>
                    ):null}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

SimpleModal.defaultProps = {
    actionButtons: null,
    button: null,
    disableOk: false,
    fullWidth: true,
    maxWidth: null,
    onClose: null,
    onKeyPress: ()=>null,
    onOk: null,
    title: null,
    tooltipMsgOk: '',
},

SimpleModal.propTypes = {
    actionButtons: PropTypes.object,
    button: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
    disableOk: PropTypes.bool,
    fullWidth: PropTypes.bool,
    maxWidth: PropTypes.string,
    onClose: PropTypes.func,
    onKeyPress: PropTypes.func,
    onOk: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    tooltipMsgOk: PropTypes.string,
};

export default SimpleModal;