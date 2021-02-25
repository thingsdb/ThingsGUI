import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    typography: {
        marginBottom: theme.spacing(1),
    },
}));


const LocalMsg = ({icon, msg, onClose}) => {
    const classes = useStyles();

    const handleCloseError = () => {
        onClose();
    };

    return (
        <Collapse in={Boolean(msg)} timeout="auto" unmountOnExit>
            <Typography className={classes.typography} component="div" variant="caption">
                <Grid component="label" container alignItems="center" spacing={2} item xs={12}>
                    <Grid item xs={2} >
                        <Avatar className={classes.avatar}>
                            {icon}
                        </Avatar>
                    </Grid>
                    <Grid item xs={8}>
                        {msg}
                    </Grid>
                    {onClose && (
                        <Grid item xs={2}>
                            <Button color="primary" aria-label="settings" onClick={handleCloseError}>
                                <CloseIcon />
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Typography>
        </Collapse>
    );
};

LocalMsg.defaultProps = {
    msg: '',
    onClose: null,
    icon: null
};

LocalMsg.propTypes = {
    msg: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClose: PropTypes.func,
    icon: PropTypes.object,
};

export default LocalMsg;