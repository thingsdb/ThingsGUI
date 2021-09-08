/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';
import {THINGS_DOC_COLLECTION, THINGS_DOC_DATETIME, THINGS_DOC_TIMEVAL} from '../../../Constants/Links';
import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddEnum, AddError, AddFloat, AddInt, AddCode, AddRegex, AddRoom, AddNil, AddStr, AddThing, AddVariable} from './InputUtils';
import {BOOL, BYTES, CLOSURE, CODE, DATETIME,ERROR, FLOAT, INT, LIST, NIL, REGEX, ROOM,
    SET, STR, THING, TIMEVAL, VARIABLE} from '../../../Constants/ThingTypes';

const InputField = ({customTypes, childTypes, dataTypes, dataType, enums, identifier, init, variables,...props}) => {

    const dispatch = useEdit()[1];

    // EditProvider needs a key to distinguish the instance
    switch(dataType){
    case CODE: return <AddCode identifier={identifier} init={init} label="Fill in .ti code" link={THINGS_DOC_COLLECTION} numLines="4" />;
    case STR: return <AddStr identifier={identifier} init={init} {...props} />;
    case INT: return <AddInt identifier={identifier} init={init} {...props} />;
    case FLOAT: return <AddFloat identifier={identifier} init={init} {...props} />;
    case BOOL: return <AddBool identifier={identifier} init={init} {...props} />;
    case CLOSURE: return <AddClosure identifier={identifier} init={init} {...props} />;
    case REGEX: return <AddRegex identifier={identifier} init={init} {...props} />;
    case ROOM: return <AddRoom dentifier={identifier} init={init} {...props} />;
    case ERROR: return <AddError identifier={identifier} init={init} {...props} />;
    case BYTES: return <AddBlob identifier={identifier} init={init} {...props} />;
    case DATETIME: return <AddCode identifier={identifier} init={init} label="Fill in a datetime" link={THINGS_DOC_DATETIME} numLines="1" />;
    case TIMEVAL: return <AddCode identifier={identifier} init={init} label="Fill in a timeval" link={THINGS_DOC_TIMEVAL} numLines="1" />;
    case NIL: return <AddNil identifier={identifier} />;
    case THING: return(
        <EditProvider key={dataType}>
            <AddThing identifier={identifier} customTypes={customTypes} enums={enums} dataTypes={dataTypes} parentDispatch={dispatch} />
        </EditProvider>
    );
    case SET: return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[THING, ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case LIST: return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    case VARIABLE: return(
        <EditProvider key={dataType}>
            <AddVariable identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} variables={variables} parentDispatch={dispatch} />
        </EditProvider>
    );
    default: return(
        [...customTypes.map(c=>c.name)].includes(dataType) ? (
            <EditProvider key={dataType}>
                <AddCustomType customTypes={customTypes} enums={enums} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
            </EditProvider>
        ) : <AddEnum identifier={identifier} enumName={dataType} enums={enums} init={init} {...props} />
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
