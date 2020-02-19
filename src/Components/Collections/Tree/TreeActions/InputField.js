/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../TreeUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, identifier, ...props}) => {

    const dispatch = useEdit()[1];

    switch(dataType){
    case 'str': return <AddStr identifier={identifier} {...props} />;
    case 'int': return <AddInt identifier={identifier} {...props} />;
    case 'float': return <AddFloat identifier={identifier} {...props} />;
    case 'bool': return <AddBool identifier={identifier} {...props} />;
    case 'closure': return <AddClosure identifier={identifier} {...props} />;
    case 'regex': return <AddRegex identifier={identifier} {...props} />;
    case 'error': return <AddError identifier={identifier} {...props} />;
    case 'bytes': return <AddBlob identifier={identifier} {...props} />;
    case 'nil': return null;
    case 'thing': return(
        <EditProvider>
            <AddThing identifier={identifier} customTypes={customTypes} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    case 'set': return(
        <EditProvider>
            <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case 'list': return(
        <EditProvider>
            <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    default: return(
        <EditProvider>
            <AddCustomType customTypes={customTypes} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
        </EditProvider>
    );
    }
};

InputField.defaultProps = {
    customTypes: [],
    dataTypes: [],
    childTypes: null,
    identifier: null,
},

InputField.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    childTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
    identifier: PropTypes.string
};

export default InputField;
