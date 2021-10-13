/*eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {Closure} from '../..';
import {EditActions, useEdit} from '../Context';


const AddClosure = ({identifier, init, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.update(dispatch, 'val', init, identifier, parent);
    }, []);

    const handleUpdateVal = (c) => {
        EditActions.update(dispatch, 'val', c, identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <Closure input={v} onChange={handleUpdateVal} />
    );
};

AddClosure.defaultProps = {
    identifier: null,
    init: '',
},

AddClosure.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddClosure;