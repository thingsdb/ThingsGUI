import PropTypes from 'prop-types';
import React from 'react';

import { InputField, useEdit } from '../../Utils';
import { BOOL, BYTES, CODE, DATETIME, FLOAT, INT, NIL, REGEX, STR, VARIABLE } from '../../../Constants/ThingTypes';


const reClosureParams = /(?<=\||,)(.*?)(?=\||,)/g;
const reObjectValues = /(?<=:)(.*?)(?=\}|,)/g;

const dataTypes = [BOOL, BYTES, CODE, DATETIME, FLOAT, INT, NIL, REGEX, STR]; // Supported types

const SetArguments = ({closure, onChange}) => {
    const editState = useEdit()[0];
    const {blob, val} = editState;

    let params = closure.match(reClosureParams);
    let argLabels = params ? params.slice(1) : [];

    React.useEffect(() => {
        let v = val.match(reObjectValues);
        let values = v ? v.map(v => v.trim()) : [];
        onChange(values, blob);
    }, [blob, onChange, val]);

    return (
        <InputField dataType={VARIABLE} dataTypes={dataTypes} variables={argLabels} />
    );
};

SetArguments.defaultProps = {
    closure: '',
};

SetArguments.propTypes = {
    closure: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default SetArguments;
