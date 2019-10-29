/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import InputField from './InputField';


const EditCustom = ({errors, cb, customTypes, name, type}) => {
    const [input, setInput] = React.useState({
        name: name,
        type: type,
        val: [],
    });
    const [openNext, setOpenNext] = React.useState(false);
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
        let type = '';
        switch (true) {
        case t.includes('str'):
            type='string';
            break;
        case t.includes('int'):
            type='number';
            break;
        case t.includes('float'):
            type='number';
            break;
        case t.includes('bool'):
            type='bool';
            break;
        case t.includes('thing'):
            type='object';
            break;
        case t.includes('['):
            type=t.substring(1,type.length-1);
            break;
        default:
            type = t;
        }
        return type;
    };

    const handleVal = (val) => {
        setInput({...input, val: val});
    };

    const handleNext = () => {
        setOpenNext(true);
    };

    const handleBack = () => {
        setOpenNext(false);
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
                <EditCustom
                    errors={errors}
                    cb={handleCustom}
                    customTypes={customTypes}
                    name={k}
                    type={type}
                />
            </React.Fragment>
        );
    };

    const renderChildren = () => {
        return (customTypes[type] && (
            <React.Fragment>
                <ListItem>
                    <ListItemText primary={name} />
                </ListItem>
                {Object.entries(customTypes[type]).map(renderThing)}
            </React.Fragment>
        ));
    };

    // const hasNext = Boolean(next);
    return(
        <React.Fragment>
            <ListItem>
                <InputField name={name} dataType={type} error="" cb={handleVal} />
            </ListItem>
            {renderChildren()}
        </React.Fragment>
    );
};

EditCustom.defaultProps = {
    customTypes: null,
};
EditCustom.propTypes = {
    cb: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default EditCustom;