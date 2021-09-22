import PropTypes from 'prop-types';
import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { amber } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';

import LocalMsg from './LocalMsg';


const useStyles = makeStyles(() => ({
    warning: {
        color: amber[700],
    },
}));


const LocalErrorMsg = ({body, onClose, title}) => {
    const classes = useStyles();
    return (
        <LocalMsg icon={<WarningIcon className={classes.warning} />} title={title} body={body} onClose={onClose} />
    );
};

LocalErrorMsg.defaultProps = {
    body: '',
    onClose: null,
    title: '',
};

LocalErrorMsg.propTypes = {
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClose: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default LocalErrorMsg;