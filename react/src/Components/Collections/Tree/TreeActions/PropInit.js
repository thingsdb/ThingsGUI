import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

const PropInit = ({
    onChange,
    input,
    thing = null
}) => {
    const [error, setError] = React.useState('');

    const errorTxt = (property) => thing[property] ? 'property name already in use' : '';

    const handleOnChangeName = ({target}) => {
        const {value} = target;
        const err = errorTxt(value);
        setError(err);
        onChange(value);
    };

    return(
        <TextField
            autoFocus
            error={Boolean(error)}
            helperText={error}
            label="New property"
            margin="dense"
            name="newProperty"
            onChange={handleOnChangeName}
            spellCheck={false}
            type="text"
            value={input}
            variant="standard"
            fullWidth
        />
    );
};

PropInit.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default PropInit;