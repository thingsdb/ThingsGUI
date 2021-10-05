/*eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {Closure} from '../..';
import {EditActions, useEdit} from '../Context';


const AddClosure = ({identifier, init}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
    }, []);

    const handleUpdateVal = (c) => {
        EditActions.updateVal(dispatch, c, identifier);
    };

    return(
        <Closure input={val[identifier]||(val.constructor === Object?'':val)} onChange={handleUpdateVal} />
    );
};

AddClosure.defaultProps = {
    identifier: null,
    init: '',
},

AddClosure.propTypes = {
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default AddClosure;