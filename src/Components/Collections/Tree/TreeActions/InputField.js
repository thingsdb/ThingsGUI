import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';

import CustomChild from './CustomChild';
import {AddArray, AddBlob, AddBool, AddClosure, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../../../Util';


const InputField = ({customTypes, dataTypes, dataType, onVal, onBlob, input, ...props}) => {

    let content;
    switch(dataType) {
    case 'str':
        content = (
            <AddStr input={input} cb={onVal} {...props} />
        );
        break;
    case 'int':
        content = (
            <AddInt input={input} cb={onVal} {...props} />
        );
        break;
    case 'float':
        content = (
            <AddFloat input={input} cb={onVal} {...props} />
        );
        break;
    case 'thing':
        content = (
            <AddThing customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} />
        );
        break;
    case 'set':
        content = (
            <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} type={['thing']} isSet />
        );
        break;
    case 'bool':
        content = (
            <AddBool input={`${input}`} cb={onVal} />
        );
        break;
    case 'list':
        content = (
            <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} {...props} />
        );
        break;
    case 'closure':
        content = (
            <AddClosure input={input} cb={onVal} />
        );
        break;
    case 'regex':
        content = (
            <AddRegex input={input.trim().slice(1, -1)} cb={onVal} />
        );
        break;
    case 'error':
        content = (
            <AddError input={input} cb={onVal} />
        );
        break;
    case 'bytes':
        content = (
            <AddBlob onBlob={onBlob} onVal={onVal} />
        );
        break;
    case 'nil':
        content = null;
        break;
    default:
        content = (
            <CustomChild onBlob={onBlob} onVal={onVal} customTypes={customTypes} dataTypes={dataTypes} type={dataType} {...props} />
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
    customTypes: [],
    dataTypes: [],
},

InputField.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
    onVal: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;