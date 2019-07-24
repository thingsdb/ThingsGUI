import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const ServerError = ({open, onClose, error}) => (
    <div>
        <Dialog
            aria-describedby="server-error-dialog-description"
            aria-labelledby="server-error-dialog-title"
            onClose={onClose}
            open={open}
        >
            <DialogTitle id="server-error-dialog-title">
                {'Server error'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="server-error-dialog-description">
                    {error}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {'CLOSE'}
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);

ServerError.propTypes = {
    error: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

ServerError.defaultProps = {
    error: '',
};

export default ServerError;