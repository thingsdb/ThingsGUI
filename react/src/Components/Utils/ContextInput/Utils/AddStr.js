/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../Context';

const AddStr = ({identifier, init, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, `'${init}'`, identifier);
        dispatch(() => ({real: init}));
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, `'${value}'`, identifier);
        dispatch(() => ({real: value}));
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            name="value"
            type="text"
            value={v[0]=='\''?v.trim().slice(1, -1):v}
            spellCheck={false}
            onChange={handleOnChange}
            multiline
            maxRows={10}
            {...props}
        />
    );
};

AddStr.defaultProps = {
    identifier: null,
    init:'',
},

AddStr.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.string,
};

export default AddStr;