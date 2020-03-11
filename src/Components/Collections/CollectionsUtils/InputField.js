/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing, AddVariable} from './InputUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, identifier, stringifyVal, ...props}) => {

    const dispatch = useEdit()[1];

    switch(dataType){
    case 'str': return <AddStr identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'int': return <AddInt identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'float': return <AddFloat identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'bool': return <AddBool identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'closure': return <AddClosure identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'regex': return <AddRegex identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'error': return <AddError identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'bytes': return <AddBlob identifier={identifier} stringifyVal={stringifyVal} {...props} />;
    case 'nil': return null;
    case 'thing': return(
        <EditProvider>
            <AddThing identifier={identifier} stringifyVal={stringifyVal} customTypes={customTypes} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    case 'set': return(
        <EditProvider>
            <AddArray identifier={identifier} stringifyVal={stringifyVal} customTypes={customTypes} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case 'list': return(
        <EditProvider>
            <AddArray identifier={identifier} stringifyVal={stringifyVal} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    case 'variable': return(
        <EditProvider>
            <AddVariable identifier={identifier} stringifyVal={stringifyVal} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    default: return(
        <EditProvider>
            <AddCustomType customTypes={customTypes} stringifyVal={stringifyVal} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
        </EditProvider>
    );
    }
};

InputField.defaultProps = {
    customTypes: [],
    dataTypes: [],
    childTypes: null,
    identifier: null,
    stringifyVal: true,
},

InputField.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    childTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    stringifyVal: PropTypes.bool,
};

export default InputField;
