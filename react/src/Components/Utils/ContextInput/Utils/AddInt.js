/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { EditActions, useEdit } from '../Context';
import { toNum } from '../../../Utils';

const onlyInts = (str) => str.length == str.replace(/[^-0-9]/g, '').length;

const AddInt = ({
    identifier = null,
    init = '',
    parent,
    ...props
}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const [error, setError] = React.useState('');

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
            EditActions.update(dispatch, 'obj', toNum(init), identifier, parent);
        }
    }, []);

    const errorTxt = (value) => {
        const err = onlyInts(value) ? '' : 'only integers';
        setError(err);
        dispatch(() => ({ error: err }));
    };

    const handleOnChange = ({target}) => {
        const {value} = target;
        errorTxt(value);
        EditActions.update(dispatch, 'val', value, identifier, parent);
        EditActions.update(dispatch, 'obj', toNum(value), identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <TextField
            name="value"
            type="text" // setting to "number" contains bug. On entering value e the input is cleared.
            value={v}
            spellCheck={false}
            onChange={handleOnChange}
            helperText={error}
            error={Boolean(error)}
            {...props}
        />
    );
};

AddInt.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddInt;