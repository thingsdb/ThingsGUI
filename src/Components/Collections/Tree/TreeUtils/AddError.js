import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {EditActions, useEdit} from '../TreeActions/Context';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
}));

const AddError = ({name}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        errCode:'',
        errMsg:'',
    });
    const {errCode, errMsg} = state;

    const [editState, dispatch] = useEdit();
    const {val} = editState;
    React.useEffect(() => {
        if(val[name]&&`err(${errCode}, '${errMsg}')`!=val[name]) {
            let commaIndex = val[name].indexOf(',', 0);
            let code = val[name].slice(4, commaIndex);
            let secondAppIndex = val[name].indexOf('\'', commaIndex+2);
            let msg = val[name].slice(commaIndex+2, secondAppIndex);

            setState({
                errCode:code,
                errMsg:msg,
            });
        }
    },
    [val[name]],
    );

    const handleOnChangeCode = ({target}) => {
        const {value} = target;
        setState({...state, errCode: value});
        const c = `err(${value}, '${errMsg}')`;
        EditActions.update(dispatch, {
            val: {...val, [name]: c},
        });
    };

    const handleOnChangeMsg = ({target}) => {
        const {value} = target;
        setState({...state, errMsg: value});
        const c = `err(${errCode}, '${value}')`;
        EditActions.update(dispatch, {
            val: {...val, [name]: c},
        });
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
                    name="errCode"
                    label="Code"
                    type="text"
                    value={errCode}
                    spellCheck={false}
                    onChange={handleOnChangeCode}
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
                    value={errMsg}
                    spellCheck={false}
                    onChange={handleOnChangeMsg}
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

AddError.propTypes = {
    name: PropTypes.string.isRequired,
};

export default AddError;