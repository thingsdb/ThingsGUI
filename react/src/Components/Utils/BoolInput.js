import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


const BoolInput = ({input, onChange}) => {
    const handleOnChange = ({target}) => {
        const {value} = target;
        onChange(value);
    };

    return(
        <RadioGroup aria-label="position" name="value" value={input} onChange={handleOnChange} row>
            <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="true"
                labelPlacement="end"
            />
            <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="false"
                labelPlacement="end"
            />
        </RadioGroup>
    );
};

BoolInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default BoolInput;