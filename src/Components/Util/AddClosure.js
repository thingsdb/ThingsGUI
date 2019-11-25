import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {VariablesArray} from '../Util';

// import { makeStyles } from '@material-ui/core/styles';



const initialState = {
    variables: [],
    doc: '',
    body: '',
    callCB: false,
};

const AddClosure = ({input, cb}) => {
    const [state, setState] = React.useState(initialState);
    const {variables, body, callCB} = state;
    const [withWse, setWithWse] = React.useState(false);
    console.log('addclosure', callCB);

    React.useEffect(() => {
        const c = withWse ? `|${variables}| wse(${body})` : `|${variables}|${body}`;
        if(input&&input!=c) {
            let endVarArr = input.indexOf('|', 1);
            let vars = input.substring(1, endVarArr).split(',');
            let b1 = input.substring(endVarArr+1);
            let b2 = b1;
            if(b1.indexOf('wse(') != -1) {
                b2 = b1.substring(4, b1.length-1);
                setWithWse(true);
            }
            let b3 = b2[0]=='{' || b2[0]=='(' ? b2.substring(1, b2.length-1) : b2;
            setState({
                variables: endVarArr==1?[]:vars,
                body: b3,
                callCB: false,
            });
        }
    },
    [input],
    );

    React.useEffect(() => {
        // console.log(variables, body, withWse);
        const c = withWse ? `|${variables}| wse(${body})` : `|${variables}|${body}`;
        if (callCB) {
            cb(c);
        }
    },
    [variables, body, withWse],
    );

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value, callCB: true});
    };

    const handleVarArray = (items) => {
        setState({...state, variables: [...items], callCB: true});
    };

    const handleWse = ({target}) => {
        const {checked} = target;
        setWithWse(checked);
        setState({...state, callCB: true});
    };

    return(
        <Grid container spacing={2}>
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
                    {React.useMemo(()=><VariablesArray cb={handleVarArray} input={variables} />, [JSON.stringify(variables)])}
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
                        onChange={handleOnChange}
                        fullWidth
                        multiline
                        rows="4"
                        variant="outlined"
                        // helperText={error}
                        // error={Boolean(error)}
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