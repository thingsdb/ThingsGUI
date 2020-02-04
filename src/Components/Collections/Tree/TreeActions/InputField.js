/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, EditProvider, useEdit} from './Context';

import {AddArray, AddBlob, AddBool, AddClosure, AddCustomType, AddError, AddFloat, AddInt, AddRegex, AddStr, AddThing} from '../TreeUtils';


const InputField = ({customTypes, childTypes, dataTypes, dataType, name, ...props}) => {

    const [editState, dispatch] = useEdit();
    let content = {
        str:  ()=><AddStr name={name} {...props} />,
        int: ()=><AddInt name={name} {...props} />,
        float: ()=><AddFloat name={name} {...props} />,
        thing: ()=>(
            <EditProvider>
                <AddThing name={name} customTypes={customTypes} dataTypes={dataTypes} parentDispatch={dispatch} />
            </EditProvider>
        ),
        set: ()=>(
            <AddArray name={name} customTypes={customTypes} childTypes={childTypes||['thing', ...customTypes.map(c=>c.name)]||[]} dataTypes={dataTypes} parentDispatch={dispatch} isSet />
        ),
        bool: ()=><AddBool />,
        list: ()=>(
            <AddArray name={name} customTypes={customTypes} childTypes={childTypes||[]} dataTypes={dataTypes} parentDispatch={dispatch} {...props} />

        ),
        closure: ()=><AddClosure name={name} />,
        regex: ()=><AddRegex name={name} />,
        error: ()=><AddError name={name} />,
        bytes: ()=><AddBlob name={name} />,
        nil: ()=>null,
    };

    return(
        <React.Fragment>
            {Object.keys(content).includes(dataType) ? content[dataType]()
                : (
                    <EditProvider>
                        <AddCustomType customTypes={customTypes} dataTypes={dataTypes} type={dataType} parentDispatch={dispatch} name={name} {...props} />
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
},

InputField.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    childTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default InputField;