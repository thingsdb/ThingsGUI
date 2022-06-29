import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

const PropertyName = ({onChange, input, ...props}) => {
    const [propertyName, setPropertyName] = React.useState(input);

    const handlePropertyName = ({target}) => {
        const { value} = target;
        setPropertyName(value);
        onChange({propertyName:value});
    };

    return (
        <TextField
            {...props} // eslint-disable-line
            fullWidth
            label="Name"
            name="propertyName"
            onChange={handlePropertyName}
            spellCheck={false}
            type="text"
            value={propertyName}
            variant="standard"
        />
    );
};

PropertyName.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default PropertyName;


