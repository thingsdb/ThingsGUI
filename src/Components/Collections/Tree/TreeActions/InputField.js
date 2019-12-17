import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';

import CustomChild from './CustomChild';
import {AddArray, AddBlob, AddBool, AddClosure, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../../../Util';


const InputField = ({customTypes, dataTypes, name, dataType, onVal, onBlob, input, ...props}) => {

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
            <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={handleBlob} onVal={handleSet} type="thing" />
        );
        break;
    case 'bool':
        content = (
            <AddBool input={`${input}`} cb={handleVal} />
        );
        break;
    case 'list':
        content = (
            <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={handleBlob} onVal={handleVal} {...props} />
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
    case 'nil':
        content = null;
        break;
    default:
        content = (
            <CustomChild onBlob={handleBlob} onVal={handleVal} customTypes={customTypes} dataTypes={dataTypes} type={dataType} />
        );
        break;
    }

    return(
        <Grid item xs={12}>
            {content}
        </Grid>
    );
};

InputField.defaultProps = {
    input: '',
    customTypes: {},
    dataTypes: [],
    name: '',
},

InputField.propTypes = {
    customTypes: PropTypes.object,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    dataType: PropTypes.string.isRequired,
    onVal: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;