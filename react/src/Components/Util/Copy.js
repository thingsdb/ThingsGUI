import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles(theme => ({
    tooltip: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));


const Copy = ({text}) => {
    const classes = useStyles();

    const setClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    return(
        <Tooltip className={classes.tooltip} disableFocusListener disableTouchListener title="Copy to Clipboard">
            <Button color="primary" onClick={setClipboard}>
                <FileCopyIcon color="primary" />
            </Button>
        </Tooltip>
    );
};

Copy.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Copy;