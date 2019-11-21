import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const initialState = {
    errCode: [],
    errMsg: '',
    validation: '',
};

const AddError = ({input, cb}) => {
    const [state, setState] = React.useState(initialState);
    const {errCode, errMsg, validation} = state;
    const [hasMsg, setHasMsg] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if(input) {
            setHasMsg(true);
            setState({
                errCode: input.error_code,
                errMsg: input.error_msg,
            });
        }
    },
    [input],
    );

    React.useEffect(() => {
        const c = hasMsg ? `err(${errCode}, '${errMsg}')` : `err(${errCode})`;
        setError(c);
    },
    [hasMsg, errCode, errMsg],
    );

    React.useEffect(() => {
        cb(error);
    },
    [error],
    );

    const handleOnChangeCode = ({target}) => {
        const {value} = target;
        setState({...state, errCode: value, validation: /^-[1-5][0-9]?$|^-1[0-2][0-9]?$/.test(value) ? '': 'expects an error code between -127 and -50'});
    };

    const handleOnChangeMsg = ({target}) => {
        const {value} = target;
        setState({...state, errMsg: value});
    };

    const handleHasMsg = ({target}) => {
        const {checked} = target;
        setHasMsg(checked);
    };

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography component="div" variant="caption">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>
                            {'Enter error message: no'}
                        </Grid>
                        <Grid item>
                            <Switch
                                checked={hasMsg}
                                color="primary"
                                onChange={handleHasMsg}
                            />
                        </Grid>
                        <Grid item>
                            {'yes'}
                        </Grid>
                    </Grid>
                </Typography>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={1} container justify="center">
                    <Typography variant="h3" color="primary">
                        {'err('}
                    </Typography>
                </Grid>
                <Grid item xs={2} container justify="center">
                    <TextField
                        name="errCode"
                        label="Code"
                        type="text"
                        value={errCode}
                        spellCheck={false}
                        onChange={handleOnChangeCode}
                        fullWidth
                        variant="outlined"
                        helperText={validation}
                        error={Boolean(validation)}
                    />
                </Grid>
                {hasMsg ? (
                    <React.Fragment>
                        <Grid item xs={1} container justify="center">
                            <Typography variant="h3" color="primary">
                                {','}
                            </Typography>
                        </Grid>
                        <Grid item xs={7} container justify="center">
                            <TextField
                                name="errMsg"
                                label="Message"
                                type="text"
                                value={errMsg}
                                spellCheck={false}
                                onChange={handleOnChangeMsg}
                                fullWidth
                                variant="outlined"
                                // helperText={error}
                                // error={Boolean(error)}
                            />
                        </Grid>
                    </React.Fragment>
                ):null}
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