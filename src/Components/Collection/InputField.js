import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool, AddClosure, AddError, AddRegex, checkType, onlyNums} from '../Util';


const InputField = ({dataType, cb, name, input, ...props}) => {
    const [val, setVal] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        cb(val);
    },
    [val],
    );

    React.useEffect(() => {
        if (input != null) {
            const type = checkType(input);
            if (!(type == 'array' || type == 'thing')){
                setVal(input);
            }
        }
    },
    [input, dataType],
    );

    const errorTxt = (value) => {
        const bool = value.length>0;
        let errText = bool?'':'is required';
        switch (dataType) {
        case 'number':
            if (bool) {
                errText = onlyNums(value) ? '' : 'only numbers';
            }
            return(errText);
        default:
            return '';
        }
    };


    const handleOnChange = ({target}) => {
        const {value} = target;
        setVal(value);
        const err = errorTxt(value);
        setError(err);
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        setVal(value);
    };

    const handleVal = (v) => {
        setVal(v);
    };


    const singleInputField = dataType == 'number' || dataType == 'string';
    const closureInputField = dataType == 'closure';
    const regexInputField = dataType == 'regex';
    const errorInputField = dataType == 'error';
    const multiInputField = dataType == 'list';
    const booleanInputField = dataType == 'boolean';
    const blobInputField = dataType == 'blob';
    const predefined = dataType == 'thing';
    const predefinedVal = '{ }';

    return(
        <React.Fragment>
            {singleInputField ? (
                <TextField
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    helperText={error}
                    error={Boolean(error)}
                    placeholder={dataType=='closure'?'example: |x,y| x+y':''}
                    {...props}
                />
            ) : multiInputField ? (
                <Add1DArray cb={handleArrayItems} />
            ) : booleanInputField ? (
                <AddBool input={checkType(input) == 'boolean' ?  `${input}` : ''} cb={handleVal} />
            ) : blobInputField ? (
                <AddBlob cb={handleVal} />
            ) : predefined ? (
                <TextField
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={predefinedVal}
                    fullWidth
                    disabled
                />
            ) : closureInputField ? (
                <AddClosure input={input} cb={handleVal} />
            ) : regexInputField ? (
                <AddRegex input={input} cb={handleVal} />
            ) : errorInputField ? (
                <AddError input={input} cb={handleVal} />
            ) : null }
        </React.Fragment>
    );
};

InputField.defaultProps = {
    input: null,
},

InputField.propTypes = {
    dataType: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;