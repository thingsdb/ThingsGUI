import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles(theme => ({
    tooltip: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));


const Copy = ({reference}) => {
    const classes = useStyles();

    const handleRef = () => {
        reference.current.focus();
        reference.current.select();
        document.execCommand('copy');
    };

    return(
        <Tooltip className={classes.tooltip} disableFocusListener disableTouchListener title="Copy to Clipboard">
            <Button color="primary" onClick={handleRef}>
                <FileCopyIcon color="primary" />
            </Button>
        </Tooltip>
    );
};

Copy.propTypes = {
    reference: PropTypes.object.isRequired,
};

export default Copy;
