/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';

const AddStr = ({identifier, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, `"${value}"`, identifier);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            name="value"
            type="text"
            value={v[0]=='"'?v.trim().slice(1, -1):v}
            spellCheck={false}
            onChange={handleOnChange}
            multiline
            rowsMax={10}
            {...props}
        />
    );
};

AddStr.defaultProps = {
    identifier: null,
},

AddStr.propTypes = {
    identifier: PropTypes.string,
};

export default AddStr;