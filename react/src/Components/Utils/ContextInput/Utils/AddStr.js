/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { EditActions, useEdit } from '../Context';
import { STRING_QUERY } from '../../../../TiQueries/Queries';

const AddStr = ({identifier, init, parent, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', STRING_QUERY(init), identifier, parent);
        }
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, 'val', STRING_QUERY(value), identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <TextField
            name="value"
            type="text"
            value={v[0]=='\'' ? v.trim().slice(1, -1) : v}
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
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.string,
    parent: PropTypes.string.isRequired,
};

export default AddStr;