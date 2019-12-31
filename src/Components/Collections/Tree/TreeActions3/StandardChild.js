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
    'pint': ['int'],
    'nint': ['int'],
    'number': ['int', 'float'],
    'any': [],
};

const StandardChild = ({onVal, onBlob, name, type, arrayType}) => {
    const classes = useStyles();
    const [blob, setBlob] = React.useState({});
    const [val, setVal] = React.useState('');
    const [dataType, setDataType] = React.useState(arrayType||typeConv[type][0]);

    React.useEffect(() => {
        onVal({name: name, type: type, val: val});
        onBlob(blob);
    },
    [val],
    );

    const handleVal = (v) => {
        setVal(v);
    };

    const handleBlob = (b) => {
        setBlob({...blob, ...b});
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
    };

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
                        <option key={p} value={p} disabled={arrayType? !(p==arrayType): type=='any' ? false : !typeConv[type].includes(p)}>
                            {p}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <InputField
                    dataType={dataType}
                    onVal={handleVal}
                    onBlob={handleBlob}
                    input={val}
                    variant="outlined"
                    type={arrayType?type:null}
                />
            </Grid>
        </Grid>
    );
};

StandardChild.defaultProps = {
    arrayType: '',
};

StandardChild.propTypes = {
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    arrayType: PropTypes.string
};

export default StandardChild;