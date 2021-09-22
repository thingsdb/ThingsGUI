import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../../CollectionsUtils';
import {SET, THING} from '../../../../Constants/ThingTypes';

const TypeInit = ({type, customTypes, dataTypes, onChange, input}) => {
    const dispatch = useEdit()[1];

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        onChange(value);
        EditActions.update(dispatch, {
            query: '',
            val: '',
            blob: {},
            array: [],
            error: '',
        });
    };

    return(
        <TextField
            fullWidth
            margin="dense"
            autoFocus
            name="dataType"
            label="Data type"
            value={input}
            onChange={handleOnChangeType}
            select
            SelectProps={{native: true}}
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