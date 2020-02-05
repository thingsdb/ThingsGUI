/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../TreeUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, identifier, ...props}) => {

    const [editState, dispatch] = useEdit();
    let content = {
        str:  ()=><AddStr identifier={identifier} {...props} />,
        int: ()=><AddInt identifier={identifier} {...props} />,
        float: ()=><AddFloat identifier={identifier} {...props} />,
        thing: ()=>(
            <EditProvider>
                <AddThing identifier={identifier} customTypes={customTypes} dataTypes={dataTypes} parentDispatch={dispatch} />
            </EditProvider>
        ),
        set: ()=>(
            <EditProvider>
                <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||['thing', ...customTypes.map(c=>c.cb)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
            </EditProvider>
        ),
        bool: ()=><AddBool identifier={identifier} />,
        list: ()=>(
            <EditProvider>
                <AddArray identifier={identifier} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />
            </EditProvider>
        ),
        closure: ()=><AddClosure identifier={identifier} />,
        regex: ()=><AddRegex identifier={identifier} />,
        error: ()=><AddError identifier={identifier} />,
        bytes: ()=><AddBlob identifier={identifier} />,
        nil: ()=>null,
    };

    return(
        <React.Fragment>
            {Object.keys(content).includes(dataType) ? content[dataType]()
                : (
                    <EditProvider>
                        <AddCustomType customTypes={customTypes} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} identifier={identifier} {...props} />
                    </EditProvider>
                )
            }
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