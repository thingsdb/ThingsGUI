import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {VariablesArray} from '../Util';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
}));


const AddClosure = ({input, cb}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        variables: [],
        body: '',
        withWse: false,
    });
    const {withWse, variables, body} = state;
    console.log('addclosure', input, variables);

    React.useEffect(() => {
        const c = withWse ? `|${variables}| wse(${body})` : `|${variables}|${body}`;
        if(input&&input!=c) {
            let endVarArr = input.indexOf('|', 1);
            let vars = input.substring(1, endVarArr).split(',');
            let b = input.substring(endVarArr+1);
            let wse = false;
            if(b.indexOf('wse(') != -1) {
                b = b.substring(4, b.length-1);
                wse = true;
            }
            b = b[0]=='{' || b[0]=='(' ? b.substring(1, b.length-1) : b;
            setState({
                variables: endVarArr==1?[]:vars,
                body: b,
                withWse: wse,
            });
        }
    },
    [input],
    );

    const handleBody = ({target}) => {
        const {value} = target;
        setState({...state, body: value});
        const c = withWse ? `|${variables}| wse(${value})` : `|${variables}|${value}`;
        cb(c);
    };

    const handleVarArray = (items) => {
        console.log('varaaray');
        setState({...state, variables: items});
        const c = withWse ? `|${items}| wse(${body})` : `|${items}|${body}`;
        cb(c);
    };

    const handleWse = ({target}) => {
        const {checked} = target;
        setState({...state, withWse: checked});
        const c = checked ? `|${variables}| wse(${body})` : `|${variables}|${body}`;
        cb(c);
    };

    return(
        <Grid className={classes.container} container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="caption" color="primary">
                    {'Stored closures which can potentially make changes to ThingsDB are called closures with side effects (wse) and must be wrapped with the wse(..) function.'}
                </Typography>
                <Typography component="div" variant="caption">
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>
                            {'With wse: no'}
                        </Grid>
                        <Grid item>
                            <Switch
                                checked={withWse}
                                color="primary"
                                onChange={handleWse}
                            />
                        </Grid>
                        <Grid item>
                            {'yes'}
                        </Grid>
                    </Grid>
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
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h3" color="primary">
                    {withWse ? 'wse({': '{'}
                </Typography>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={1} />
                <Grid item xs={10} container justify="center">
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
            <Grid item xs={12}>
                <Typography variant="h3" color="primary">
                    {withWse ? '})': '}'}
                </Typography>
            </Grid>
        </Grid>
    );
};

AddClosure.defaultProps = {
    input: '',
};

AddClosure.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default AddClosure;