import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool} from '../Util';


const InputField = ({dataType, error, cb, name}) => {

    const [val, setVal] = React.useState('');

    React.useEffect(() => {
        cb(val);
    },
    [val],
    );


    const handleOnChange = ({target}) => {
        const {value} = target;
        setVal(value);
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
                    // label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    helperText={error}
                    error={Boolean(error)}
                />
            ) : multiInputField ? (
                <Add1DArray cb={handleArrayItems} />
            ) : booleanInputField ? (
                <AddBool cb={handleBool} />
            ) : blobInputField ? (
                <AddBlob cb={handleBlob} />
            ) : closureInputField ? (
                <TextField
                    margin="dense"
                    name={name}
                    // label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    placeholder="example: |x,y| x+y"
                    helperText={error}
                    error={Boolean(error)}
                />
            ) : null}
        </React.Fragment>
    );
};

InputField.defaultProps = {
    error: '',
};

InputField.propTypes = {
    dataType: PropTypes.string.isRequired,
    error: PropTypes.string,
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default InputField;