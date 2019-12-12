import PropTypes from 'prop-types';
import React from 'react';

import {Add1DArray, AddBlob, AddBool, AddClosure, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../../../Util';


const InputField = ({dataType, cb, name, input, ...props}) => {

    const handleVal = (v) => {
        cb(v);
    };

    const handleSet = (s) => {
        cb(`set(${s})`);
    };

    let content;
    switch(dataType) {
    case 'str':
        content = (
            <AddStr input={input.trim().slice(1, -1)} cb={handleVal} {...props} />
        );
        break;
    case 'int':
        content = (
            <AddInt input={input} cb={handleVal} {...props} />
        );
        break;
    case 'float':
        content = (
            <AddFloat input={input} cb={handleVal} {...props} />
        );
        break;
    case 'thing':
        content = (
            <AddThing cb={handleVal} />
        );
        break;
    case 'set':
        content = (
            <Add1DArray cb={handleSet} type="thing" />
        );
        break;
    case 'bool':
        content = (
            <AddBool input={`${input}`} cb={handleVal} />
        );
        break;
    case 'list':
        content = (
            <Add1DArray cb={handleVal} {...props} />
        );
        break;
    case 'closure':
        content = (
            <AddClosure input={input} cb={handleVal} />
        );
        break;
    case 'regex':
        content = (
            <AddRegex input={input.trim().slice(1, -1)} cb={handleVal} />
        );
        break;
    case 'error':
        content = (
            <AddError input={input} cb={handleVal} />
        );
        break;
    case 'bytes':
        content = (
            <AddBlob cb={handleVal} />
        );
        break;
    default:
        content = null;
        break;
    }

    return(
        <React.Fragment>
            {content}
        </React.Fragment>
    );
};

InputField.defaultProps = {
    input: '',
},

InputField.propTypes = {
    dataType: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;