import { amber } from '@mui/material/colors';
import PropTypes from 'prop-types';
import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import LocalMsg from './LocalMsg';
import useThingsError from './useThingsError';


const LocalErrorMsg = ({msg, onClose, useAsPopUp}) => {
    const [title, body] = useThingsError(msg);
    return (
        <LocalMsg icon={<WarningIcon sx={{color: amber[700]}} />} title={title} body={body} onClose={onClose} useAsPopUp={useAsPopUp} />
    );
};

LocalErrorMsg.defaultProps = {
    msg: '',
    onClose: null,
    useAsPopUp: false,
};

LocalErrorMsg.propTypes = {
    msg: PropTypes.string,
    onClose: PropTypes.func,
    useAsPopUp: PropTypes.bool,
};

export default LocalErrorMsg;