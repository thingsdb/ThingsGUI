import {makeStyles} from '@material-ui/core';
import FailedIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import React from 'react';
import SuccessIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';


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