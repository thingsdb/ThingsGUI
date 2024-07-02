import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


const WarnPopover = ({
    anchorEl = {},
    onClose,
    onOk = null,
    description,
}) => {
    const openPopOver = Boolean(anchorEl);

    return (
        <Popover
            open={openPopOver}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            sx={{
                '& .MuiPopover-paper': {
                    padding: '8px',
                    backgroundColor: 'primary.warning',
                }
            }}
        >
            <Typography variant="body2">
                {description}
            </Typography>
            <Button color="primary" onClick={onClose}>
                {'Close'}
            </Button>
            {onOk && (
                <Button color="primary" onClick={onOk}>
                    {'Ok'}
                </Button>
            )}
        </Popover>
    );
};

WarnPopover.propTypes = {
    anchorEl: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func,
    description: PropTypes.string.isRequired,
};

export default WarnPopover;
