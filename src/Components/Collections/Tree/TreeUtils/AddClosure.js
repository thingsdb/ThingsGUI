import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {VariablesArray} from '../../../Util';
import { makeStyles } from '@material-ui/core/styles';
import {EditActions, useEdit} from '../TreeActions/Context';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
}));


const AddClosure = ({identifier}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        variables: [],
        body: '',
    });
    const {variables, body} = state;

    const [editState, dispatch] = useEdit();
    const {val} = editState;
    React.useEffect(() => {
        const c = `|${variables}|${body}`;
        const v = val[identifier]||(val.constructor === Object?'':val);
        if(v&&v!=c) {
            let endVarArr = v.indexOf('|', 1);
            let vars = v.slice(1, endVarArr).split(',');
            let b = v.slice(endVarArr+1);
            setState({
                variables: endVarArr==1?[]:vars,
                body: b,
            });
        }
    },
    [val],
    );

    const handleBody = ({target}) => {
        const {value} = target;
        setState({...state, body: value});
        EditActions.updateVal(dispatch, `|${variables}|${value}`, identifier);
    };

    const handleVarArray = (items) => {
        setState({...state, variables: items});
        EditActions.updateVal(dispatch, `|${items}|${body}`, identifier);
    };


    return(
        <Grid className={classes.container} container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'|'}
                    </Typography>
                </Grid>
                <Grid item xs={10} container >
                    <VariablesArray cb={handleVarArray} input={variables} />
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {'|'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField
                    name="body"
                    label="Body"
                    type="text"
                    value={body}
                    spellCheck={false}
                    onChange={handleBody}
                    fullWidth
                    multiline
                    rows="4"
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
};

AddClosure.defaultProps = {
    identifier: null,
},

AddClosure.propTypes = {
    identifier: PropTypes.string
};

export default AddClosure;