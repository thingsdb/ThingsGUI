/* eslint-disable react/jsx-props-no-spreading */
import ClickAwayListener from '@mui/material/ClickAwayListener';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';


const SendButton = ({
    disabled = false,
    label,
    loading,
    onClickSend,
    variant = 'outlined',
}) => {
    const [openTooltip, setOpenTooltip] = React.useState(false);

    const handleSubmit = () => {
        setOpenTooltip(true);
        onClickSend();
    };

    const handleCloseTooltip = () => {
        setOpenTooltip(false);
    };

    return(
        <ClickAwayListener onClickAway={handleCloseTooltip}>
            <div>
                <Tooltip
                    PopperProps={{
                        disablePortal: true,
                    }}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title="Send!"
                    onClose={handleCloseTooltip}
                    open={openTooltip}
                >
                    <LoadingButton
                        color="primary"
                        disabled={disabled}
                        onClick={handleSubmit}
                        loading={loading}
                        variant={variant}
                    >
                        {label}
                    </LoadingButton>
                </Tooltip>
            </div>
        </ClickAwayListener>
    );
};

SendButton.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    onClickSend: PropTypes.func.isRequired,
    variant: PropTypes.string,
};

export default SendButton;

