/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, useEdit} from '../Context';
import {NIL} from '../../../../Constants/ThingTypes';


const AddNil = ({
    identifier = null,
    parent
}: Props) => {
    const dispatch = useEdit()[1];

    React.useEffect(()=>{
        EditActions.update(dispatch, 'val', NIL, identifier, parent);
        EditActions.update(dispatch, 'obj', null, identifier, parent);
    }, []);

    return  null;
};

AddNil.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parent: PropTypes.string.isRequired,
};

export default AddNil;

interface Props {
    identifier: string | number;
    parent: string;
}
