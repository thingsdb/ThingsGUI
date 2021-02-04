import PropTypes from 'prop-types';
import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';

import LocalMsg from './LocalMsg';


const useStyles = makeStyles(() => ({
    warning: {
        color: amber[700],
    },
}));


const LocalErrorMsg = ({msgError, onClose}) => {
    const classes = useStyles();
    return (
        <LocalMsg icon={<WarningIcon className={classes.warning} />} msg={msgError} onClose={onClose} />
    );
};

LocalErrorMsg.defaultProps = {
    msgError: '',
    onClose: null,
};

LocalErrorMsg.propTypes = {
    msgError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClose: PropTypes.func,
};

export default LocalErrorMsg;