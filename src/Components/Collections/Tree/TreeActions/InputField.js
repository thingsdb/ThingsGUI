/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../TreeUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, onVal, onBlob, input, ...props}) => {

    let content = {
        str:  ()=><AddStr input={input} cb={onVal} {...props} />,
        int: ()=><AddInt input={input} cb={onVal} {...props} />,
        float: ()=><AddFloat input={input} cb={onVal} {...props} />,
        thing: ()=><AddThing customTypes={customTypes} dataTypes={dataTypes} onBlob={onBlob} onVal={onVal} />,
        set: ()=><AddArray customTypes={customTypes} dataTypes={childTypes||['thing']} onBlob={onBlob} onVal={onVal} isSet />,
        bool: ()=><AddBool input={`${input}`} cb={onVal} />,
        list: ()=><AddArray customTypes={customTypes} dataTypes={childTypes||dataTypes} onBlob={onBlob} onVal={onVal} {...props} />,
        closure: ()=><AddClosure input={input} cb={onVal} />,
        regex: ()=><AddRegex input={input.trim().slice(1, -1)} cb={onVal} />,
        error: ()=><AddError input={input} cb={onVal} />,
        bytes: ()=><AddBlob onBlob={onBlob} onVal={onVal} />,
        nil: ()=>null,
    };

    return(
        <React.Fragment>
            {Object.keys(content).includes(dataType)?content[dataType](): <AddCustomType onBlob={onBlob} onVal={onVal} customTypes={customTypes} dataTypes={dataTypes} type={dataType} {...props} />}
        </React.Fragment>
    );
};

InputField.defaultProps = {
    input: '',
    customTypes: [],
    dataTypes: [],
    childTypes: null,
},

InputField.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    childTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
    onVal: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;