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