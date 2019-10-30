/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import InputField from './InputField';


const CustomChild = ({errors, cb, customTypes, name, type, activeStep, stepId}) => {
    const [input, setInput] = React.useState({
        name: name,
        type: type,
        val: [],
    });
    React.useEffect(() => {
        cb(input);
    },
    [JSON.stringify(input || {})],
    );

    React.useEffect(() => {
        setInput(prevInput => {
            const updatedInput = Object.assign({}, prevInput, {name: name, type: type});
            return updatedInput;
        });
    },
    [name, type],
    );

    const setType = (t) => {
        let type = [];
        switch (true) {
        case t.includes('str'):
            type=['string', 'str'];
            break;
        case t.includes('int'):
            type=['number', 'int'];
            break;
        case t.includes('float'):
            type=['number', 'float'];
            break;
        case t.includes('bool'):
            type=['boolean', 'bool'];
            break;
        case t.includes('thing'):
            type=['thing', 'thing'];
            break;
        // case t.includes('['): //array
        //     type=t.substring(1,typeConv.length-1);
        //     break;
        // case t.includes('{'): // set
        //     type=t.substring(1,typeConv.length-1);
        //     break;
        default:
            type =[t, t];
        }
        return type;
    };

    const handleVal = (val) => {
        setInput({...input, val: val});
    };

    const handleCustom = (c) => {
        setInput(prevInput => {
            let updatedInput;
            if (prevInput.val) {
                let b=false;
                let copy = [...prevInput.val];
                prevInput.val.map((v, i) => {
                    if (v.name == c.name) {
                        copy.splice(i, 1, c);
                        b=true;
                    }
                });
                updatedInput = b?copy:[...prevInput.val, c];
            } else {
                updatedInput = [c];
            }
            return {...prevInput, val: updatedInput};
        });
    };

    const renderThing = ([k, v]) => {
        const type = setType(v);
        return (
            <React.Fragment key={k}>
                <CustomChild
                    errors={errors}
                    cb={handleCustom}
                    customTypes={customTypes}
                    name={k}
                    type={type[1]}
                    activeStep={activeStep}
                    stepId={stepId+1}
                />
            </React.Fragment>
        );
    };

    const renderChildren = () => {
        return (customTypes[type] && (
            <Collapse in={stepId!=activeStep} timeout="auto">
                {Object.entries(customTypes[type]).map(renderThing)}
            </Collapse>
        ));
    };

    return(
        <React.Fragment>
            <Collapse in={stepId==activeStep} timeout="auto">
                <ListItem>
                    <ListItemText
                        primary={name}
                        secondary={setType(type)[0]}
                        color="primary"
                        primaryTypographyProps={{color:'primary'}}
                        // secondaryTypographyProps={{variant:'caption'}}
                    />
                </ListItem>
                <ListItem>
                    <InputField name={name} dataType={setType(type)[0]} error="" cb={handleVal} />
                </ListItem>
            </Collapse>
            {renderChildren()}
        </React.Fragment>
    );
};

CustomChild.defaultProps = {
    customTypes: null,
};
CustomChild.propTypes = {
    cb: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeStep: PropTypes.number.isRequired,
    stepId: PropTypes.number.isRequired,
};

export default CustomChild;