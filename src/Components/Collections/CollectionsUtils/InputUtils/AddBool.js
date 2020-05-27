/*eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {BoolInput} from '../../../Util';
import {EditActions, useEdit} from '../Context';

const AddBool = ({identifier, init}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
    }, []);

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
    init: '',
},

AddBool.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default AddBool;