import FailedIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';
import React from 'react';
import SuccessIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';


const StatusIcon = ({status}: Props) => (
    status === 'running' ? (
        <Tooltip disableFocusListener disableTouchListener title={status}>
            <SuccessIcon sx={{color: 'primary.green'}} />
        </Tooltip>
    ) : (
        <Tooltip disableFocusListener disableTouchListener title={status}>
            <FailedIcon color="error" />
        </Tooltip>
    )
);

StatusIcon.propTypes = {
    status: PropTypes.string.isRequired,
};

export default StatusIcon;

interface Props {
    status: string;
}