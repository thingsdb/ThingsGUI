import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const AddStr = ({input, cb, ...props}) => {

    const handleOnChange = ({target}) => {
        const {value} = target;
        cb(`'${value}'`);
    };

    return(
        <TextField
            name="value"
            type="text"
            value={input[0]=='\''?input.trim().slice(1, -1):input}
            spellCheck={false}
            onChange={handleOnChange}
            // fullWidth
            multiline
            rowsMax={10}
            {...props}
            // helperText={error}
            // error={Boolean(error)}
        />
    );
};

AddStr.defaultProps = {
    input: '',
};

AddStr.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default AddStr;