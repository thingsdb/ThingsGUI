/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
}));


const AddRegex = ({identifier, init}) => {
    const classes = useStyles();
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, `/${value}/`, identifier);
    };
    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <Grid className={classes.container} container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={1} container justifyContent="flex-start">
                    <Typography variant="h3" color="primary">
                        {'/'}
                    </Typography>
                </Grid>
                <Grid item xs={10} container >
                    <TextField
                        name="regex"
                        label="Regex"
                        type="text"
                        value={v.trim().slice(1, -1)}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        maxRows={10}
                        multiline
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={1} container justifyContent="flex-end">
                    <Typography variant="h3" color="primary">
                        {'/'}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

AddRegex.defaultProps = {
    identifier: null,
    init: '',
},

AddRegex.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.string,
};

export default AddRegex;