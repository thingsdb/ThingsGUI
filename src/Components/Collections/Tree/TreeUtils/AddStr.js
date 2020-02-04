/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../TreeActions/Context';

const AddStr = ({name, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, {
            val: {...val, [name]:`'${value}'`},
        });
    };

    return(
        <TextField
            name="value"
            type="text"
            value={val[name]?(val[name][0]=='\''?val[name].trim().slice(1, -1):val[name]):''}
            spellCheck={false}
            onChange={handleOnChange}
            multiline
            rowsMax={10}
            {...props}
        />
    );
};


AddStr.propTypes = {
    name: PropTypes.string.isRequired,
};

export default AddStr;