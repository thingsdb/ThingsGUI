/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../Context';

const onlyInts = (str) => str.length == str.replace(/[^0-9]/g, '').length;

const AddInt = ({identifier, init, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const [error, setError] = React.useState('');

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
        EditActions.updateReal(dispatch, init);
    }, []);

    const errorTxt = (value) => {
        setError(onlyInts(value) ? '' : 'only integers');
    };

    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
        EditActions.updateVal(dispatch, value, identifier);
        EditActions.updateReal(dispatch, value);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            name="value"
            type="text"
            value={v}
            spellCheck={false}
            onChange={handleOnChange}
            helperText={error}
            error={Boolean(error)}
            {...props}
        />
    );
};

AddInt.defaultProps = {
    identifier: null,
    init:'',
},

AddInt.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AddInt;