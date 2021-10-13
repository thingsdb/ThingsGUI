/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {BoolInput} from '../..';
import {EditActions, useEdit} from '../Context';

const AddBool = ({identifier, init, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
        }
    }, []);

    const handleOnChange = (b) => {
        EditActions.update(dispatch, 'val', b, identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <BoolInput input={`${v}`} onChange={handleOnChange} />
    );
};

AddBool.defaultProps = {
    identifier: null,
    init: '',
},

AddBool.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddBool;