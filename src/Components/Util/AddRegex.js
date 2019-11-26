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


const AddRegex = ({input, cb}) => {
    const classes = useStyles();
    const handleOnChange = ({target}) => {
        const {value} = target;
        cb(value);
    };

    return(
        <Grid className={classes.container} container spacing={2}>
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