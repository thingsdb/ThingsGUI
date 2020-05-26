import PropTypes from 'prop-types';
import React from 'react';

import {BoolInput} from '../../../Util';
import {EditActions, useEdit} from '../Context';

const AddBool = ({identifier}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const handleOnChange = (b) => {
        EditActions.updateVal(dispatch, b, identifier);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <BoolInput input={`${v}`} cb={handleOnChange} />
    );
};

AddBool.defaultProps = {
    identifier: null,
},

AddBool.propTypes = {
    identifier: PropTypes.string,
};

export default AddBool;