/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import InputField from './InputField';


const EditCustom = ({errors, cb, customTypes, type}) => {
    const [input, setInput] = React.useState({});
    const [next, setNext] = React.useState(null);
    React.useEffect(() => {
        cb(input);
    },
    [JSON.stringify(input || {})],
    );

    const handleVal = (key) => (val) => {
        setInput(prevInput => {
            const updatedInput = Object.assign({}, prevInput, {[key]: val});
            return updatedInput;
        });
    };

    const handleClick = (k, t) => () => {
        setNext({key:k, type:t});
    };

    const renderChildren = () => {
        return (next &&
            <React.Fragment>
                <EditCustom
                    errors={errors}
                    cb={cb}
                    customTypes={customTypes}
                    type={next.type}
                />
            </React.Fragment>
        );
    };

    const setInputField = (k, t) => {
        let type = '';
        switch (true) {
        case t.includes('str'):
            type='string';
            break;
        case t.includes('int'):
            type='string';
            break;
        case t.includes('float'):
            type='string';
            break;
        case t.includes('bool'):
            type='string';
            break;
        case t.includes('thing'):
            return(
                <Button onClick={handleClick(k, t)}>
                    {`${k}: ${t}`}
                </Button>
            );
        case t.includes('['):
            return(
                <Button onClick={handleClick(k, t.substring(1,t.length-1))}>
                    {`${k}: ${t}`}
                </Button>
            );
        default:
            return(
                <Button onClick={handleClick(k, t)}>
                    {`${k}: ${t}`}
                </Button>
            );
        }

        return(
            <InputField name={k} dataType={type} error="" cb={handleVal(k)} />
        );

    };

    const hasNext = Boolean(next);
    return(
        <React.Fragment>
            <Collapse in={!hasNext} timeout="auto">
                {customTypes[type] && Object.entries(customTypes[type]).map(([k, t]) => (
                    <ListItem key={k}>
                        {setInputField(k, t)}
                    </ListItem>
                ))}
            </Collapse>
            <Collapse in={hasNext} timeout="auto">
                {renderChildren()}
            </Collapse>
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
    type: PropTypes.string.isRequired,
};

export default EditCustom;