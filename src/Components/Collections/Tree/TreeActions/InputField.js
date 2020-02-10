/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../TreeUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, identifier, ...props}) => {

    const [editState, dispatch] = useEdit();
    return(
        <React.Fragment>
            {dataType == 'str' ? <AddStr identifier={identifier} {...props} />
                : dataType == 'int' ? <AddInt identifier={identifier} {...props} />
                    : dataType == 'float' ? <AddFloat identifier={identifier} {...props} />
                        : dataType == 'bool' ? <AddBool identifier={identifier} {...props} />
                            : dataType == 'closure' ? <AddClosure identifier={identifier} {...props} />
                                : dataType == 'regex' ? <AddRegex identifier={identifier} {...props} />
                                    : dataType == 'error' ? <AddError identifier={identifier} {...props} />
                                        : dataType == 'bytes' ? <AddBlob identifier={identifier} {...props} />
                                            : dataType == 'nil' ? null
                                                : dataType == 'thing' ? (
                                                    <EditProvider>
                                                        <AddThing identifier={identifier} customTypes={customTypes} dataTypes={dataTypes} parentDispatch={dispatch} />
                                                    </EditProvider>
                                                ) : dataType == 'set' ? (
                                                    <EditProvider>
                                                        <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
                                                    </EditProvider>
                                                ) : dataType == 'list' ? (
                                                    <EditProvider>
                                                        <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
                                                    </EditProvider>
                                                ) : (
                                                    <EditProvider>
                                                        <AddCustomType customTypes={customTypes} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
                                                    </EditProvider>
                                                )}
        </React.Fragment>
    );
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