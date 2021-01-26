import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const PropertyName = ({cb, input}) => {
    const [propertyName, setPropertyName] = React.useState(input);

    const handlePropertyName = ({target}) => {
        const { value} = target;
        setPropertyName(value);
        cb({propertyName:value});
    };

    return (
        <TextField
            autoFocus
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
    cb: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default PropertyName;


