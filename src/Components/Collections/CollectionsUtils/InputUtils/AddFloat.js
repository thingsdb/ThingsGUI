/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';

const onlyFloats = (str) => str.length == str.replace(/[^0-9.]/g, '').length && str.includes('.');

const AddFloat = ({identifier, ...props}) => {
    const [error, setError] = React.useState('');
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const errorTxt = (value) => {
        setError(onlyFloats(value) ? '' : 'only floats');
    };
    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
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
            multiline
            rowsMax={10}
            helperText={error}
            error={Boolean(error)}
            {...props}
        />
    );
};

AddFloat.defaultProps = {
    identifier: null,
},

AddFloat.propTypes = {
    identifier: PropTypes.string
};

export default AddFloat;