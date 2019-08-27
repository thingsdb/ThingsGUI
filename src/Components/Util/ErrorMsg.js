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


const useStyles = makeStyles({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
});

const ErrorMsg = ({error, onClose}) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Collapse in={Boolean(error)} timeout="auto" unmountOnExit>
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>
                            <Avatar className={classes.avatar}>
                                <WarningIcon className={classes.warning} />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            {error}
                        </Grid>
                        <Grid item>
                            <IconButton aria-label="settings" onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Typography>
            </Collapse>
        </React.Fragment>
    );
};

ErrorMsg.propTypes = {
    error: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ErrorMsg;