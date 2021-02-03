import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    popover: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.warning,
    },

}));

const WarnPopover = ({anchorEl, onClose, onOk, description}) => {
    const classes = useStyles();

    const openPopOver = Boolean(anchorEl);

    return (
        <Popover
            classes={{paper: classes.popover}}
            open={openPopOver}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
        >
            <Typography variant="body2">
                {description}
            </Typography>
            <Button color="primary" onClick={onClose}>
                {'Close'}
            </Button>
            {onOk && (
                <Button color="primary" onClick={onOk}>
                    {'Ok'}
                </Button>
            )}
        </Popover>
    );
};

WarnPopover.defaultProps = {
    anchorEl: {},
    onOk: null,
};

WarnPopover.propTypes = {
    anchorEl: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func,
    description: PropTypes.string.isRequired,
};

export default WarnPopover;
