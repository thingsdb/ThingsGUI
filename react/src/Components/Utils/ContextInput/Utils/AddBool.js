/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {BoolInput} from '../..';
import {EditActions, useEdit} from '../Context';

const AddBool = ({identifier, init}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
        dispatch(() => ({real: init}));
    }, []);

    const handleOnChange = (b) => {
        EditActions.updateVal(dispatch, b, identifier);
        dispatch(() => ({real: b}));
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <BoolInput input={`${v}`} onChange={handleOnChange} />
    );
};

AddBool.defaultProps = {
    identifier: null,
    init: '',
},

AddBool.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default AddBool;