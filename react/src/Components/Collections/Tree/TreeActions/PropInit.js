import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

const PropInit = ({onChange, input, thing}) => {
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
            margin="dense"
            name="newProperty"
            label="New property"
            type="text"
            value={input}
            spellCheck={false}
            onChange={handleOnChangeName}
            helperText={error}
            error={Boolean(error)}
        />
    );
};

PropInit.defaultProps = {
    thing: null,
},

PropInit.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default PropInit;