import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const AddRegex = ({input, cb}) => {

    const handleOnChange = ({target}) => {
        const {value} = target;
        cb(value);
    };

    return(
        <Grid container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'/'}
                    </Typography>
                </Grid>
                <Grid item xs={10} container >
                    <TextField
                        name="regex"
                        label="Regex"
                        type="text"
                        value={input}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        multiline
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {'/'}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

AddRegex.defaultProps = {
    input: '',
};

AddRegex.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default AddRegex;