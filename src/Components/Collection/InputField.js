import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool, AddClosure, AddError, AddRegex, checkType, onlyNums} from '../Util';


const InputField = ({dataType, cb, name, input, ...props}) => {
    const [error, setError] = React.useState('');

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
        cb(value);
        const err = errorTxt(value);
        setError(err);
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        cb(value);
    };

    const handleRegex = (r) => {
        cb(`/${r}/`);
    };

    const handleError = (e) => {
        cb(`err(${e.errCode}, '${e.errMsg}')`); //check
    };

    const handleVal = (v) => {
        cb(v);
    };


    const singleInputField = dataType == 'number' || dataType == 'str' || dataType == 'int' || dataType == 'uint' || dataType == 'float' || dataType == 'utf8' || dataType == 'raw';
    const closureInputField = dataType == 'closure';
    const regexInputField = dataType == 'regex';
    const errorInputField = dataType == 'error';
    const multiInputField = dataType == 'list';
    const booleanInputField = dataType == 'bool';
    const blobInputField = dataType == 'bytes';
    const predefined = dataType == 'thing';
    const predefinedVal = '{ }';

    console.log('inputfieldcomp', input);


    return(
        <React.Fragment>
            {singleInputField ? (
                <TextField
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={input}
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
                <AddBool input={`${input}`} cb={handleVal} />
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
                <AddRegex input={input.trim().substring(1, input.length-1)} cb={handleRegex} />
            ) : errorInputField ? (
                <AddError input={input} cb={handleError} />
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