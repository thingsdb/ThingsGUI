/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../Context';

const onlyFloats = (str) => str.length == str.replace(/[^0-9.]/g, '').length && str.includes('.');

const AddFloat = ({identifier, init, parent, ...props}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const [error, setError] = React.useState('');

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
        }
    }, []);

    const errorTxt = (value) => {
        setError(onlyFloats(value) ? '' : 'only floats');
    };
    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
        EditActions.update(dispatch, 'val', value, identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

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

AddFloat.defaultProps = {
    identifier: null,
    init: '',
},

AddFloat.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddFloat;