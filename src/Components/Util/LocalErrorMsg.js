import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
    typography: {
        marginBottom: theme.spacing(1),
    },
}));


const LocalErrorMsg = ({msgError, onClose}) => {
    const classes = useStyles();

    const handleCloseError = () => {
        onClose();
    };

    return (
        <Collapse in={Boolean(msgError)} timeout="auto" unmountOnExit>
            <Typography className={classes.typography} component="div" variant="caption">
                <Grid component="label" container alignItems="center" spacing={2} item xs={12}>
                    <Grid item xs={2} >
                        <Avatar className={classes.avatar}>
                            <WarningIcon className={classes.warning} />
                        </Avatar>
                    </Grid>
                    <Grid item xs={8}>
                        {msgError}
                    </Grid>
                    {onClose && (
                        <Grid item xs={2}>
                            <IconButton aria-label="settings" onClick={handleCloseError}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            </Typography>
        </Collapse>
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