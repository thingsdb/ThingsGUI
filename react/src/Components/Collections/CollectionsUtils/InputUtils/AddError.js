/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import {EditActions, useEdit} from '../Context';
import {CollectionActions} from '../../../../Stores';
import {ThingActionsDialogTAG} from '../../../../Constants/Tags';

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
        if(init) {
            CollectionActions.query(init.scope, `{code: #${init.parentId}.${init.propName}.code(), msg: #${init.parentId}.${init.propName}.msg()}`, ThingActionsDialogTAG, handleErr);
        }
    }, []);

    const handleErr = (data) => {
        saveErr(data.code, data.msg);
    };

    const handleOnChangeCode = ({target}) => {
        const {value} = target;
        saveErr(value, errMsg);
    };

    const handleOnChangeMsg = ({target}) => {
        const {value} = target;
        saveErr(errCode, value);
    };

    const saveErr = (code, msg) => {
        const c = `err(${code}, '${msg}')`;
        EditActions.updateVal(dispatch, c, identifier);
        setState({errCode: code, errMsg: msg});
    };

    return(
        <Grid className={classes.container} container item xs={12} spacing={2}>
            <Grid item xs={2} container justifyContent="center">
                <Typography variant="h3" color="primary">
                    {'err('}
                </Typography>
            </Grid>
            <Grid item xs={4} container justifyContent="center">
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
            <Grid item xs={1} container justifyContent="center">
                <Typography variant="h3" color="primary">
                    {','}
                </Typography>
            </Grid>
            <Grid item xs={4} container justifyContent="center">
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
            <Grid item xs={1} container justifyContent="center">
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
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AddError;