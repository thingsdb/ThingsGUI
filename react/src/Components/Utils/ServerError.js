import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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