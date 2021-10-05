import { amber } from '@mui/material/colors';
import PropTypes from 'prop-types';
import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

import LocalMsg from './LocalMsg';


const LocalErrorMsg = ({body, onClose, title}) => (
    <LocalMsg icon={<WarningIcon sx={{color: amber[700]}} />} title={title} body={body} onClose={onClose} />
);

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