/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EditActions, useEdit } from '../Context';
import { CollectionActions } from '../../../../Stores';
import { ThingActionsDialogTAG } from '../../../../Constants/Tags';


const AddError = ({identifier, init}) => {
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
        const c = msg ? `err(${code}, '${msg}')` : `err(${code})`;
        EditActions.updateVal(dispatch, c, identifier);
        setState({errCode: code, errMsg: msg});
    };

    return(
        <Grid container item xs={12} spacing={1} sx={{paddingTop: '8px', marginTop: '8px'}}>
            <Grid item xs={2} container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {'err('}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        helperText="between -127 and -50"
                        label="Code"
                        name="errCode"
                        onChange={handleOnChangeCode}
                        spellCheck={false}
                        type="text"
                        value={errCode}
                        variant="standard"
                    />
                </Grid>
            </Grid>
            <Grid item xs={1} container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {','}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        helperText="optional"
                        label="Message"
                        name="errMsg"
                        onChange={handleOnChangeMsg}
                        spellCheck={false}
                        type="text"
                        value={errMsg}
                        variant="standard"
                    />
                </Grid>
            </Grid>
            <Grid item xs={1} container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {')'}
                    </Typography>
                </Grid>
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