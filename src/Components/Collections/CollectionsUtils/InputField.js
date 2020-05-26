/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddEnum, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing, AddVariable} from './InputUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, enums, identifier, variables,...props}) => {

    const dispatch = useEdit()[1];
    console.log('hi', dataType)

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
            <AddThing identifier={identifier} customTypes={customTypes} enums={enums} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    case 'set': return(
        <EditProvider>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case 'list': return(
        <EditProvider>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    case 'variable': return(
        <EditProvider>
            <AddVariable identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} variables={variables} parentDispatch={dispatch} />
        </EditProvider>
    );
    default: return(
        [...customTypes.map(c=>c.name)].includes(dataType) ? (
            <EditProvider>
                <AddCustomType customTypes={customTypes} enums={enums} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
            </EditProvider>
        ) : <AddEnum identifier={identifier} enum_={dataType} enums={enums} {...props} />
    );
    }
};

InputField.defaultProps = {
    childTypes: null,
    customTypes: [],
    dataTypes: [],
    enums: [],
    identifier: null,
    variables: [],
},

InputField.propTypes = {
    childTypes: PropTypes.arrayOf(PropTypes.string),
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataType: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    enums: PropTypes.arrayOf(PropTypes.object),
    identifier: PropTypes.string,
    variables: PropTypes.arrayOf(PropTypes.string),
};

export default InputField;
