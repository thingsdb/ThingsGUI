/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';


const onlyFloats = (str) => str.length == str.replace(/[^0-9.]/g, '').length && str.includes('.');
const AddFloat = ({input, cb, ...props}) => {
    const [error, setError] = React.useState('');
    const errorTxt = (value) => {
        setError(onlyFloats(value) ? '' : 'only floats');
    };
    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
        cb(value);
    };

    return(
        <TextField
            name="value"
            type="text"
            value={input}
            spellCheck={false}
            onChange={handleOnChange}
            multiline
            rowsMax={10}
            helperText={error}
            error={Boolean(error)}
            {...props}
        />
    );
};

AddFloat.defaultProps = {
    input: '',
};

AddFloat.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AddFloat;