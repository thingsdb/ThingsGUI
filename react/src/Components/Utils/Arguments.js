/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import { InputField, useEdit } from './ContextInput';
import { BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL } from '../../Constants/ThingTypes';


const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types

const Arguments = ({onChange}) => {
    const editState = useEdit()[0];
    const { real } = editState;

    React.useEffect(() => {
        onChange(real);
    }, [real]);

    return (
        <InputField dataType={THING} dataTypes={dataTypes} />
    );
};


Arguments.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default Arguments;




