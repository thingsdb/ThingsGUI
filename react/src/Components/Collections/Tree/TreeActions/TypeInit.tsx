import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../../../Utils';
import {SET, THING} from '../../../../Constants/ThingTypes';

const TypeInit = ({type, customTypes, dataTypes, onChange, input}) => {
    const dispatch = useEdit()[1];

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        onChange(value);
        EditActions.resetState(dispatch);
    };

    return(
        <TextField
            fullWidth
            label="Data type"
            margin="dense"
            name="dataType"
            onChange={handleOnChangeType}
            select
            slotProps={{select: {native: true}}}
            value={input}
            variant="standard"
        >
            {dataTypes.map((d, i) => (
                <option key={i} value={d} disabled={type==SET&&!(d==THING||Boolean(customTypes.find(c=>c.name==d)))} >
                    {d}
                </option>
            ))}
        </TextField>
    );
};


TypeInit.propTypes = {
    onChange: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    type: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.string.isRequired,
};

export default TypeInit;