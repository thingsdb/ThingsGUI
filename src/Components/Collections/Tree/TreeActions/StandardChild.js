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
        paddingLeft: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));

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
    'any': ['str'],
};

const StandardChild = ({customTypes, dataTypes, onVal, onBlob, name, type, arrayType}) => {
    const classes = useStyles();
    const [val, setVal] = React.useState('');
    const [dataType, setDataType] = React.useState(arrayType||(typeConv[type]?typeConv[type][0]:type));

    const handleVal = (v) => {
        setVal(v);
        onVal(v);
    };

    const handleBlob = (b) => {
        onBlob(b);
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
        if (value == 'nil') {
            console.log(dataType, type);
            setVal('nil');
        }
    };
    console.log(val);


    return(
        <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
                <TextField
                    id="dataType"
                    type="text"
                    name="dataType"
                    label="Data type"
                    onChange={handleChangeType}
                    value={dataType.slice(-1)=='?'?dataType.slice(0, -1):dataType}
                    variant="outlined"
                    fullWidth
                    select
                    SelectProps={{native: true}}
                >
                    {dataTypes.map((p) => (
                        <option key={p} value={p} disabled={arrayType? !(p==arrayType): type=='any' ? false : type.slice(-1)=='?'?!( type.slice(0, -1)==p || p=='nil' ): !(typeConv[type]?typeConv[type].includes(p):p==type)}>
                            {p}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <InputField
                    customTypes={customTypes}
                    dataType={dataType}
                    dataTypes={dataTypes}
                    input={val}
                    onBlob={handleBlob}
                    onVal={handleVal}
                    type={arrayType?(type.slice(-1)=='?'?[type.slice(0, -1), 'nil']:[type]):null}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
};

StandardChild.defaultProps = {
    arrayType: '',
};

StandardChild.propTypes = {
    customTypes: PropTypes.object.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    arrayType: PropTypes.string
};

export default StandardChild;