/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import { InputField, useEdit } from './ContextInput';
import { BOOL, FLOAT, INT, LIST, NIL, STR, THING } from '../../Constants/ThingTypes';
import { isObjectEmpty } from '../Utils';


const dataTypes = [BOOL, FLOAT, INT, LIST, NIL, STR, THING]; // Supported types

const Arguments = ({onChange}: Props) => {
    const editState = useEdit()[0];
    const { obj } = editState;

    React.useEffect(() => {
        onChange(isObjectEmpty(obj) ? null : obj);
    }, [obj]);

    return (
        <InputField dataType={THING} dataTypes={dataTypes} />
    );
};


Arguments.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default Arguments;

interface Props {
    onChange: (d: any) => void;
}