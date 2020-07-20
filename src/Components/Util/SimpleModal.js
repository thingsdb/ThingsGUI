/*eslint-disable react/jsx-props-no-spreading*/

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

const SimpleModal = ({
    actionButtons,
    button,
    children,
    disableOk,
    maxWidth,
    onClose,
    onKeyPress,
    onOk,
    open,
    title,
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
                fullWidth
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
                        <Button onClick={handleOk} disabled={disableOk} color="primary">
                            {'Submit'}
                        </Button>
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
    disableOk: null,
    maxWidth: null,
    onClose: null,
    onKeyPress: ()=>null,
    onOk: null,
    title: null,
},

SimpleModal.propTypes = {
    actionButtons: PropTypes.object,
    button: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
    disableOk: PropTypes.bool,
    maxWidth: PropTypes.string,
    onClose: PropTypes.func,
    onKeyPress: PropTypes.func,
    onOk: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
};

export default SimpleModal;