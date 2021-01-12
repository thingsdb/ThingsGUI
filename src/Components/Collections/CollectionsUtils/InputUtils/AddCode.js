/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';

const AddCode = ({identifier, init, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, value, identifier);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            name="value"
            type="text"
            value={v}
            spellCheck={false}
            onChange={handleOnChange}
            fullWidth
            multiline
            rows="4"
            rowsMax="10"
            variant="outlined"
            {...props}
        />
    );
};

AddCode.defaultProps = {
    identifier: null,
    init:'',
},

AddCode.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AddCode;