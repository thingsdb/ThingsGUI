/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider, useEdit} from './Context';
import {THINGS_DOC_COLLECTION, THINGS_DOC_DATETIME, THINGS_DOC_TIMEVAL, THINGS_DOC_TYPES} from '../../../Constants/Links';
import {AddArray, AddBlob, AddBool, AddClosure, AddEnum, AddError, AddFloat, AddInt, AddCode, AddRegex, AddRoom, AddNil, AddStr, AddThing, AddType, AddVariable} from './Utils';
import {BOOL, BYTES, CLOSURE, CODE, DATETIME, ERROR, FLOAT, INT, LIST, NIL, REGEX, ROOM,
    SET, STR, THING, TIMEVAL, VARIABLE} from '../../../Constants/ThingTypes';

const InputField = ({
    customTypes = [],
    childTypes = null,
    dataTypes = [],
    dataType,
    enums = [],
    identifier = null,
    init = '',
    parent = THING,
    variables = [],
    ...props
}: Props) => {

    const dispatch = useEdit()[1];

    // EditProvider needs a key to distinguish the instance
    switch(dataType){
    case CODE: return <AddCode identifier={identifier} init={init} parent={parent} label="Fill in .ti code" link={THINGS_DOC_COLLECTION} numLines="4" />;
    case STR: return <AddStr identifier={identifier} init={init} parent={parent} {...props} />;
    case INT: return <AddInt identifier={identifier} init={init} parent={parent} {...props} />;
    case FLOAT: return <AddFloat identifier={identifier} init={init} parent={parent} {...props} />;
    case BOOL: return <AddBool identifier={identifier} init={init} parent={parent} {...props} />;
    case CLOSURE: return <AddClosure identifier={identifier} init={init} parent={parent} {...props} />;
    case REGEX: return <AddRegex identifier={identifier} init={init} parent={parent} {...props} />;
    case ROOM: return <AddRoom identifier={identifier} init={init} parent={parent} {...props} />;
    case ERROR: return <AddError identifier={identifier} init={init} parent={parent} {...props} />;
    case BYTES: return <AddBlob identifier={identifier} init={init} parent={parent} {...props} />;
    case DATETIME: return <AddCode identifier={identifier} init={init} parent={parent} label="Fill in a datetime" link={THINGS_DOC_DATETIME} numLines="1" />;
    case TIMEVAL: return <AddCode identifier={identifier} init={init} parent={parent} label="Fill in a timeval" link={THINGS_DOC_TIMEVAL} numLines="1" />;
    case NIL: return <AddNil identifier={identifier} parent={parent} />;
    case THING: return(
        <EditProvider key={dataType}>
            <AddThing identifier={identifier} customTypes={customTypes} enums={enums} dataTypes={dataTypes} parent={parent} parentDispatch={dispatch} />
        </EditProvider>
    );
    case SET: return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[THING, ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parent={parent} parentDispatch={dispatch} isSet />
        </EditProvider>
    );
    case LIST: return(
        <EditProvider key={dataType}>
            <AddArray identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} parent={parent} parentDispatch={dispatch} {...props} />
        </EditProvider>
    );
    case VARIABLE: return(
        <EditProvider key={dataType}>
            <AddVariable identifier={identifier} customTypes={customTypes} enums={enums} childTypes={childTypes||[]} dataTypes={dataTypes} variables={variables} parent={parent} parentDispatch={dispatch} />
        </EditProvider>
    );
    default: return(
        [...customTypes.map(c=>c.name)].includes(dataType) ? (
            <AddType identifier={identifier} type={dataType} label="Value" link={THINGS_DOC_TYPES} numLines="1" parent={parent} />
        ) : <AddEnum identifier={identifier} enumName={dataType} enums={enums} init={init} parent={parent} {...props} />
    );
    }
};

InputField.propTypes = {
    childTypes: PropTypes.arrayOf(PropTypes.string),
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataType: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    enums: PropTypes.arrayOf(PropTypes.object),
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
    parent: PropTypes.string,
    variables: PropTypes.arrayOf(PropTypes.string),
};

export default InputField;


interface Props {
    childTypes?: string[];
    customTypes?: any[];
    dataType: string;
    dataTypes: string[];
    enums?: object[];
    identifier?: string | number;
    init: any;
    parent?: string;
    variables?: string[];
}
