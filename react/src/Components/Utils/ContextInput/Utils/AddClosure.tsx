/*eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {Closure} from '../..';
import {EditActions, useEdit} from '../Context';


const AddClosure = ({
    identifier = null,
    init = '',
    parent
}: Props) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
        }
    }, []);

    const handleUpdateVal = (c: string) => {
        EditActions.update(dispatch, 'val', c, identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <Closure input={v} onChange={handleUpdateVal} />
    );
};

AddClosure.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddClosure;

interface Props {
    identifier: string | number;
    init: object | string;
    parent: string;
}
