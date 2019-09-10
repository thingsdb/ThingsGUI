import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const SimpleModal = ({children, button, title, actionButtons, open, onOk, onClose}) => {

    const handleClose = () => {
        onClose();
    };

    const handleOk = () => {
        onOk();
    };

    return (
        <React.Fragment>
            {button}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    {actionButtons}

                    <Button onClick={handleClose} color="primary">
                        {'Cancel'}
                    </Button>
                    {onOk ? (
                        <Button onClick={handleOk} color="primary">
                            {'Ok'}
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

SimpleModal.defaultProps = {
    actionButtons: null,
    onOk: null,
},

SimpleModal.propTypes = {
    children: PropTypes.object.isRequired,
    button: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    actionButtons: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onOk: PropTypes.func,
    onClose: PropTypes.func.isRequired,
};

export default SimpleModal;