/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
}));

const AddError = ({identifier, init}) => {
    const classes = useStyles();
    const dispatch = useEdit()[1];
    const [state, setState] = React.useState({
        errCode:'',
        errMsg:'',
    });
    const {errCode, errMsg} = state;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
        let commaIndex = init.indexOf(',', 0);
        let code = init.slice(4, commaIndex);
        let secondAppIndex = init.indexOf('\'', commaIndex);
        let msg = init.slice(secondAppIndex+1, -2);

        setState({
            errCode:code,
            errMsg:msg,
        });
    }, []);

    const handleOnChangeCode = ({target}) => {
        const {value} = target;
        setState({...state, errCode: value});
        const c = `err(${value}, '${errMsg}')`;
        EditActions.updateVal(dispatch, c, identifier);

    };

    const handleOnChangeMsg = ({target}) => {
        const {value} = target;
        setState({...state, errMsg: value});
        const c = `err(${errCode}, '${value}')`;
        EditActions.updateVal(dispatch, c, identifier);
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

AddError.defaultProps = {
    identifier: null,
    init: '',
},

AddError.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.string,
};

export default AddError;