/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import { InputField, useEdit } from './ContextInput';
import { BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL } from '../../Constants/ThingTypes';


const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types

const Arguments = ({onChange}) => {
    const editState = useEdit()[0];
    const { val } = editState;

    React.useEffect(() => {
        let search = (val || '').search(/\w:/g);
        onChange(search === -1 ? null : val);
    }, [val]);

    return (
        <InputField dataType={THING} dataTypes={dataTypes} />
    );
};


Arguments.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default Arguments;




