import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const AddError = ({input, cb}) => {

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        cb({...input, [name]: value});
    };

    return(
        <Grid container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={2} container justify="center">
                    <Typography variant="h3" color="primary">
                        {'err('}
                    </Typography>
                </Grid>
                <Grid item xs={4} container justify="center">
                    <TextField
                        name="errCode"
                        label="Code"
                        type="text"
                        value={input.errCode}
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
                        name="errMsg"
                        label="Message"
                        type="text"
                        value={input.errMsg}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        variant="outlined"
                        // helperText={error}
                        // error={Boolean(error)}
                    />
                </Grid>
                <Grid item xs={1} container justify="center">
                    <Typography variant="h3" color="primary">
                        {')'}
                    </Typography>
                </Grid>
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