/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import VariablesArray from './VariablesArray';


const useStyles = makeStyles(theme => ({
    border: {
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        border: '1px solid #525557',
        position: 'relative',
        borderRadius: '5px',
        zIndex: 1,
    },
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    label: {
        position: 'absolute',
        top: '-10px',
        left: '10px',
        height: '20px',
        border: 'None',
        textAlign: 'center',
        paddingLeft: '3px',
        paddingRight: '3px',
        backgroundColor: theme.palette.background.paper,
        zIndex: 2,
    },
    someMargin: {
        margin: theme.spacing(1)
    },
}));


const Closure = ({input, onChange}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        variables: [],
        body: '',
    });
    const {variables, body} = state;

    React.useEffect(() => {
        const c = `|${variables}|${body}`;
        if(input) {
            if (input!=c) {
                let endVarArr = input.indexOf('|', 1);
                let vars = input.slice(1, endVarArr).split(',');
                let b = input.slice(endVarArr+1);
                setState({
                    variables: endVarArr==1?[]:vars,
                    body: b,
                });
            }

        } else {
            setState({
                variables: [],
                body: '',
            });
        }
    },
    [input],
    );

    const handleBody = ({target}) => {
        const {value} = target;
        setState({...state, body: value});
        onChange(`|${variables}|${value}`);
    };

    const handleVarArray = (items) => {
        setState({...state, variables: items});
        onChange(`|${items}|${body}`);
    };


    return(
        <Grid className={classes.container} container>
            <Grid className={classes.border} container item xs={12}>
                <Typography className={classes.label} variant="caption">
                    {'Arguments'}
                </Typography>
                <VariablesArray onChange={handleVarArray} input={variables} />
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <TextField
                    className={classes.someMargin}
                    name="body"
                    label="Body"
                    type="text"
                    value={body}
                    spellCheck={false}
                    onChange={handleBody}
                    fullWidth
                    multiline
                    minRows="4"
                    maxRows="10"
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
};

Closure.defaultProps = {
    input: null,
},

Closure.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default Closure;