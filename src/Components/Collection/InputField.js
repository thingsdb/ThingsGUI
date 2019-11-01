import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool, onlyNums} from '../Util';


const InputField = ({dataType, cb, name, input}) => {
    console.log(input);
    const [val, setVal] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        cb(val);
    },
    [val],
    );

    React.useEffect(() => {
        let i = '';
        switch (dataType) {
        case 'string', 'number':
            i = input;
            break;
        case 'closure':
            i = input['>'];
            break;
        }
        setVal(i);
    },
    [input],
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
        case 'closure':
            if (bool) {
                errText = /^((?:\|[a-zA-Z\s]*(?:[,][a-zA-Z\s]*)*\|)|(?:\|\|))(?:(?:[\s]|[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>])*[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>]+)$/.test(value) ? '':'closure is not valid';
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

    const handleBlob = (blob) => {
        setVal(blob);
    };

    const handleBool = (bool) => {
        setVal(bool);
    };

    const singleInputField = dataType == 'number' || dataType == 'string';
    const multiInputField = dataType == 'array';
    const booleanInputField = dataType == 'boolean';
    const blobInputField = dataType == 'blob';
    const closureInputField = dataType == 'closure';

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
                />
            ) : multiInputField ? (
                <Add1DArray input={input} cb={handleArrayItems} />
            ) : booleanInputField ? (
                <AddBool input={input} cb={handleBool} />
            ) : blobInputField ? (
                <AddBlob cb={handleBlob} />
            ) : closureInputField ? (
                <TextField
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    placeholder="example: |x,y| x+y"
                    helperText={error}
                    error={Boolean(error)}
                />
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