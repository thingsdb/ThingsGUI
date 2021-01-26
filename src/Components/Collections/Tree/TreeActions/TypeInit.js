import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../../CollectionsUtils';

const TypeInit = ({type, customTypes, dataTypes, cb, input}) => {
    const dispatch = useEdit()[1];

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        cb(value);
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
                <option key={i} value={d} disabled={type=='set'&&!(d=='thing'||Boolean(customTypes.find(c=>c.name==d)))} >
                    {d}
                </option>
            ))}
        </TextField>
    );
};


TypeInit.propTypes = {
    cb: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    type: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.string.isRequired,
};

export default TypeInit;