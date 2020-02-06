import PropTypes from 'prop-types';
import React from 'react';

import {Closure} from '../../../Util';
import {EditActions, useEdit} from '../TreeActions/Context';


const AddClosure = ({identifier}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const handleUpdateVal = (c) => {
        EditActions.updateVal(dispatch, c, identifier);
    };

    return(
        <Closure input={val[identifier]||(val.constructor === Object?'':val)} cb={handleUpdateVal} />
    );
};

AddClosure.defaultProps = {
    identifier: null,
},

AddClosure.propTypes = {
    identifier: PropTypes.string
};

export default AddClosure;