/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, useEdit} from '../Context';

const AddNil = ({identifier}) => {
    const dispatch = useEdit()[1];

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, 'nil', identifier);
    }, []);

    return  null;
};

AddNil.defaultProps = {
    identifier: null,
},

AddNil.propTypes = {
    identifier: PropTypes.string,
};

export default AddNil;