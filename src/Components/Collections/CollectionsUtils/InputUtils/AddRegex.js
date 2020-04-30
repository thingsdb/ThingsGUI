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


const AddRegex = ({identifier}) => {
    const classes = useStyles();
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, `/${value}/`, identifier);

    };
    const v = val[identifier]||(val.constructor === Object?'':val);

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
                        value={v.trim().slice(1, -1)}
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
    identifier: null,
},

AddRegex.propTypes = {
    identifier: PropTypes.string,

};

export default AddRegex;