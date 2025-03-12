/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { EditActions, useEdit } from '../Context';
import { STRING_FORMAT_QUERY } from '../../../../TiQueries/Queries';

const AddStr = ({
    identifier = null,
    init = '',
    parent,
    ...props
}: Props) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', STRING_FORMAT_QUERY(init), identifier, parent);
            EditActions.update(dispatch, 'obj', init, identifier, parent);
        }
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, 'val', STRING_FORMAT_QUERY(value), identifier, parent);
        EditActions.update(dispatch, 'obj', value, identifier, parent);
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

AddStr.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.string,
    parent: PropTypes.string.isRequired,
};

export default AddStr;

interface Props {
    identifier: string | number;
    init: string;
    parent: string;
}
