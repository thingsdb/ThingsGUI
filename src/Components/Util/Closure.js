/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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


const Closure = ({input, cb}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        variables: [],
        body: '',
    });
    const {variables, body} = state;

    React.useEffect(() => {
        const c = `|${variables}|${body}`;
        const v = input;
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
    [input],
    );

    const handleBody = ({target}) => {
        const {value} = target;
        setState({...state, body: value});
        cb(`|${variables}|${value}`);
    };

    const handleVarArray = (items) => {
        setState({...state, variables: items});
        cb(`|${items}|${body}`);
    };


    return(
        <Grid className={classes.container} container>
            {/* <Grid container item xs={12}>
                <Typography variant="caption">
                    {'Arguments'}
                </Typography>
            </Grid>
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
            </Grid> */}
            <Grid className={classes.border} container item xs={12}>
                <Typography className={classes.label} variant="caption">
                    {'Arguments'}
                </Typography>
                <VariablesArray cb={handleVarArray} input={variables} />
            </Grid>
            <Grid item xs={12} container justify="center">
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
                    rows="4"
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
    cb: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default Closure;