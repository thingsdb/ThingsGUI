import PropTypes from 'prop-types';
import React from 'react';

import { InputField, useEdit } from '../../Utils';
import { BOOL, BYTES, CODE, FLOAT, INT, LIST, NIL, STR, THING, VARIABLE } from '../../../Constants/ThingTypes';


const reClosureParams = /(?<=,)(.*?)(?=\||,)/g;

const dataTypes = [BOOL, BYTES, CODE, FLOAT, INT, LIST, NIL, STR, THING]; // Supported types

const SetArguments = ({closure, onChange}) => {
    const editState = useEdit()[0];
    const {blob, obj} = editState;

    let argLabels = closure.match(reClosureParams);

    React.useEffect(() => {
        let values = Object.values(obj);
        onChange(values, blob);
    }, [blob, onChange, obj]);

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
