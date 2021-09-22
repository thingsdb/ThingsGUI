import makeStyles from '@mui/styles/makeStyles';
import FailedIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';
import React from 'react';
import SuccessIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';


const useStyles = makeStyles(theme => ({
    green: {
        color: theme.palette.primary.green,
    },
}));


const StatusIcon = ({status}) => {
    const classes = useStyles();

    return (
        status === 'running' ? (
            <Tooltip disableFocusListener disableTouchListener title={status}>
                <SuccessIcon className={classes.green} />
            </Tooltip>
        ) : (
            <Tooltip disableFocusListener disableTouchListener title={status}>
                <FailedIcon color="error" />
            </Tooltip>
        )
    );
};

StatusIcon.propTypes = {
    status: PropTypes.string.isRequired,
};

export default StatusIcon;