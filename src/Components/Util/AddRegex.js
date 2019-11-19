import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const AddRegex = ({input, cb}) => {
    const [regex, setRegex] = React.useState('');

    React.useEffect(() => {
        if(input) {
            let i = input.substring(1, input.length-1);
            setRegex(i);
        }
    },
    [input],
    );

    React.useEffect(() => {
        cb(`/${regex}/`);
    },
    [regex],
    );

    const handleOnChange = ({target}) => {
        const {value} = target;
        setRegex(value);
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
                        margin="dense"
                        name="regex"
                        label="Regex"
                        type="text"
                        value={regex}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        multiline
                        variant="outlined"
                        // helperText={error}
                        // error={Boolean(error)}
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