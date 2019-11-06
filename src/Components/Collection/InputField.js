import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool, checkType, onlyNums} from '../Util';


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
            if (type != 'array' && type != 'thing'){
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

    const singleInputField = dataType == 'number' || dataType == 'string' || dataType == 'closure';
    const multiInputField = dataType == 'array';
    const booleanInputField = dataType == 'boolean';
    const blobInputField = dataType == 'blob';
    const predefined = dataType == 'thing'; //|| dataType == 'set';
    const predefinedVal = dataType == 'thing' ? '{ }':'set( [ { } ] )';

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
                <AddBool input={checkType(input) == 'boolean' ?  `${input}` : ''} cb={handleBool} />
            ) : blobInputField ? (
                <AddBlob cb={handleBlob} />
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