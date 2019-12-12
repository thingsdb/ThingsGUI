/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import InputField from './InputField';

const useStyles = makeStyles(theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));

const dataTypes = [ // Do not put array first; causes infinite loop
    'str',
    'bool',
    'int',
    'float',
    'bytes',
    'closure',
    'regex',
    'error',
    'nil',
    'list',
    'set',
    'thing',
];

const typeConv = {
    'bool': ['bool'],
    'bytes': ['bytes'],
    'closure': ['closure'],
    'error': ['error'],
    'float': ['float'],
    'int': ['int'],
    'list': ['list'],
    'nil': ['nil'],
    'regex': ['regex'],
    'set': ['set'],
    'str': ['str'],
    'thing': ['thing'],
    'utf8': ['str'],
    'raw': ['str', 'bytes'],
    'uint': ['int'],
    'number': ['int', 'float'],
    '[' : ['list'],
    '{': ['set'],
    'any': [],
};

const StandardChild = ({cb, name, type}) => {
    const classes = useStyles();
    const [val, setVal] = React.useState('');
    const [dataType, setDataType] = React.useState(dataTypes[0]);

    console.log(type, dataType);

    React.useEffect(() => {
        cb({name: name, type: type, val: val});
    },
    [val],
    );

    const handleVal = (v) => {
        setVal(v);
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
    };

    const disable = (p) => type=='any' ? false
        : type[0]=='[' || type[0]=='{' ? !typeConv[type[0]].includes(p)
            : !typeConv[type].includes(p);


    return(
        <Grid className={classes.container} container item xs={12} spacing={1}>
            <Grid item xs={12}>
                <TextField
                    id="dataType"
                    type="text"
                    name="dataType"
                    label="Data type"
                    onChange={handleChangeType}
                    value={dataType}
                    variant="outlined"
                    fullWidth
                    select
                    SelectProps={{native: true}}
                >
                    {dataTypes.map((p) => (
                        <option key={p} value={p} disabled={disable(p)}>
                            {p}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <InputField
                    dataType={dataType}
                    cb={handleVal}
                    name="Input"
                    input={val}
                    variant="outlined"
                    type={type[0]=='['?type.slice(1, -1):null}
                />
            </Grid>
        </Grid>
    );
};

StandardChild.propTypes = {
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default StandardChild;