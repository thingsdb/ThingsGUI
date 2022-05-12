/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CollectionActions } from '../../../../Stores';
import { EditActions, useEdit } from '../Context';
import { ERROR_OUTPUT_ARGS } from '../../../../TiQueries/Arguments';
import { ERROR_OUPUT_QUERY, ERROR_FORMAT_QUERY } from '../../../../TiQueries/Queries';
import { ThingActionsDialogTAG } from '../../../../Constants/Tags';


const AddError = ({identifier, init, parent}) => {
    const [state, setState] = React.useState({
        errCode:'',
        errMsg:'',
    });
    const {errCode, errMsg} = state;
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (val) {
            let v = identifier === null ? val : val[identifier] || '';
            let endIndex = v.indexOf(',');
            if (endIndex === -1) {
                setState({errCode: v.slice(4, -1), errMsg: ''});
            } else {
                setState({errCode: v.slice(4, endIndex), errMsg: v.slice(endIndex + 3, -2)});
            }
        } else {
            setState({errCode: '', errMsg: ''});
        }
    }, [identifier, val]);

    React.useEffect(()=>{
        if (init) {
            CollectionActions.query(
                init.scope,
                ERROR_OUPUT_QUERY,
                ThingActionsDialogTAG,
                handleErr,
                null,
                null,
                ERROR_OUTPUT_ARGS(init.parentId, init.propName)
            );
        }
    }, []);

    const handleErr = (data) => {
        const [code, msg] = data;
        saveErr(code, msg);
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
        const c = ERROR_FORMAT_QUERY(code, msg);
        EditActions.update(dispatch, 'val', c, identifier, parent);
        setState({errCode: code, errMsg: msg});
    };

    return(
        <Grid container item xs={12} spacing={1} sx={{paddingTop: '8px', marginTop: '8px'}}>
            <Grid item xs={1} container alignItems="center" justifyContent="flex-start">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {'err('}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems="center" justifyContent="flex-start">
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
            <Grid item xs={1} container alignItems="center" justifyContent="flex-start">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {','}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems="center" justifyContent="flex-start">
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
            <Grid item xs={2} container alignItems="center" justifyContent="flex-start">
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
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    parent: PropTypes.string.isRequired,
};

export default AddError;