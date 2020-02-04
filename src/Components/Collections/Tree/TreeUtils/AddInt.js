/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../TreeActions/Context';

const onlyInts = (str) => str.length == str.replace(/[^0-9]/g, '').length;

const AddInt = ({name, ...props}) => {
    const [error, setError] = React.useState('');
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const errorTxt = (value) => {
        setError(onlyInts(value) ? '' : 'only integers');
    };

    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
        EditActions.update(dispatch, {
            val: {...val, [name]: value},
        });
    };

    return(
        <TextField
            name="value"
            type="text"
            value={val[name]?val[name]:''}
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

AddInt.propTypes = {
    name: PropTypes.string.isRequired,
};

export default AddInt;