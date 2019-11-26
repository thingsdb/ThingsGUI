import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
}));

const AddError = ({input, cb}) => {
    const classes = useStyles();

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        cb({...input, [name]: value});
    };

    return(
        <Grid className={classes.container} container item xs={12} spacing={2}>
            <Grid item xs={2} container justify="center">
                <Typography variant="h3" color="primary">
                    {'err('}
                </Typography>
            </Grid>
            <Grid item xs={4} container justify="center">
                <TextField
                    name="error_code"
                    label="Code"
                    type="text"
                    value={input.error_code}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    variant="outlined"
                    helperText="between -127 and -50"
                />
            </Grid>
            <Grid item xs={1} container justify="center">
                <Typography variant="h3" color="primary">
                    {','}
                </Typography>
            </Grid>
            <Grid item xs={4} container justify="center">
                <TextField
                    name="error_msg"
                    label="Message"
                    type="text"
                    value={input.error_msg}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={1} container justify="center">
                <Typography variant="h3" color="primary">
                    {')'}
                </Typography>
            </Grid>
        </Grid>
    );
};

AddError.defaultProps = {
    input: null,
};

AddError.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default AddError;