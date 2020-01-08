import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const onlyInts = (str) => str.length == str.replace(/[^0-9]/g, '').length;

const AddInt = ({input, cb, ...props}) => {
    const [error, setError] = React.useState('');
    const errorTxt = (value) => {
        setError(onlyInts(value) ? '' : 'only integers');
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
            // fullWidth
            multiline
            rowsMax={10}
            helperText={error}
            error={Boolean(error)}
            {...props}
        />
    );
};

AddInt.defaultProps = {
    input: '',
};

AddInt.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AddInt;