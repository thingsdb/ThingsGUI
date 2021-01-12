/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddEnum, AddError, AddFloat, AddInt, AddCode, AddRegex, AddStr, AddThing, AddVariable} from './InputUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, enums, identifier, init, variables,...props}) => {

    const dispatch = useEdit()[1];

    // EditProvider needs a key to distinguish the instance
    switch(dataType){
    case 'code': return <AddCode identifier={identifier} init={init} {...props} />;
    case 'str': return <AddStr identifier={identifier} init={init} {...props} />;
    case 'int': return <AddInt identifier={identifier} init={init} {...props} />;
    case 'float': return <AddFloat identifier={identifier} init={init} {...props} />;
    case 'bool': return <AddBool identifier={identifier} init={init} {...props} />;
    case 'closure': return <AddClosure identifier={identifier} init={init} {...props} />;
    case 'regex': return <AddRegex identifier={identifier} init={init} {...props} />;
    case 'error': return <AddError identifier={identifier} init={init} {...props} />;
    case 'bytes': return <AddBlob identifier={identifier} init={init} {...props} />;
    case 'nil': return null;
    case 'thing': return(
        <EditProvider key={dataType}>
            <AddThing identifier={identifier} customTypes={customTypes} enums={enums} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    case 'set': return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case 'list': return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    case 'variable': return(
        <EditProvider key={dataType}>
            <AddVariable identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} variables={variables} parentDispatch={dispatch} />
        </EditProvider>
    );
    default: return(
        [...customTypes.map(c=>c.name)].includes(dataType) ? (
            <EditProvider key={dataType}>
                <AddCustomType customTypes={customTypes} enums={enums} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
            </EditProvider>
        ) : <AddEnum identifier={identifier} enum_={dataType} enums={enums} init={init} {...props} />
    );
    }
};

InputField.defaultProps = {
    childTypes: null,
    customTypes: [],
    dataTypes: [],
    enums: [],
    identifier: null,
    init: '',
    variables: [],
},

InputField.propTypes = {
    childTypes: PropTypes.arrayOf(PropTypes.string),
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataType: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    enums: PropTypes.arrayOf(PropTypes.object),
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
    variables: PropTypes.arrayOf(PropTypes.string),
};

export default InputField;
