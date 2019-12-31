import PropTypes from 'prop-types';
import React from 'react';

import {AddArray, AddBlob, AddBool, AddClosure, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../../../Util';


const InputField = ({dataType, onVal, onBlob, input, ...props}) => {

    const handleVal = (v) => {
        onVal(v);
    };

    const handleBlob = (b) => {
        onBlob(b);
    };

    const handleSet = (s) => {
        onVal(`set(${s})`);
    };

    let content;
    switch(dataType) {
    case 'str':
        content = (
            <AddStr input={input} cb={handleVal} {...props} />
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
            <AddThing onBlob={handleBlob} onVal={handleVal} />
        );
        break;
    case 'set':
        content = (
            <AddArray onBlob={handleBlob} onVal={handleSet} type="thing" />
        );
        break;
    case 'bool':
        content = (
            <AddBool input={`${input}`} cb={handleVal} />
        );
        break;
    case 'list':
        content = (
            <AddArray onBlob={handleBlob} onVal={handleVal} {...props} />
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
            <AddBlob onBlob={handleBlob} onVal={handleVal} />
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
    onVal: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;