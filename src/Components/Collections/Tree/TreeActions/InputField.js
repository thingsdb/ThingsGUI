import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';

import CustomChild from './CustomChild';
import {AddArray, AddBlob, AddBool, AddClosure, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../../../Util';


const InputField = ({customTypes, dataTypes, dataType, onVal, onBlob, input, ...props}) => {

    let content = {
        str:  <AddStr input={input} cb={onVal} {...props} />,
        int: <AddInt input={input} cb={onVal} {...props} />,
        float: <AddFloat input={input} cb={onVal} {...props} />,
        thing: <AddThing customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} />,
        set: <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} type={['thing']} isSet />,
        bool: <AddBool input={`${input}`} cb={onVal} />,
        list: <AddArray customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} {...props} />,
        closure: <AddClosure input={input} cb={onVal} />,
        regex: <AddRegex input={input.trim().slice(1, -1)} cb={onVal} />,
        error: <AddError input={input} cb={onVal} />,
        bytes: <AddBlob onBlob={onBlob} onVal={onVal} />,
        nil: null,
    };

    return(
        <Grid item xs={12}>
            {Object.keys(content).includes(dataType)?content[dataType]: <CustomChild onBlob={onBlob} onVal={onVal} customTypes={customTypes} dataTypes={dataTypes} type={dataType} {...props} />}
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