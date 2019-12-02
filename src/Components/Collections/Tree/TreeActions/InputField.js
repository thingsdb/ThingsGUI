import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Add1DArray, AddBlob, AddBool, AddClosure, AddError, AddRegex, onlyNums} from '../../../Util';


const InputField = ({dataType, cb, name, input, ...props}) => {
    const [error, setError] = React.useState('');

    const errorTxt = (value) => {
        const bool = value.length>0;
        let errText = bool?'':'is required';
        switch (dataType) {
        case 'number':
            if (bool) {
                errText = onlyNums(value) ? '' : 'only numbers';
            }
            return(errText);
        default:
            return '';
        }
    };

    const handleOnChange = ({target}) => {
        const {value} = target;
        cb(value);
        const err = errorTxt(value);
        setError(err);
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        cb(value);
    };

    const handleRegex = (r) => {
        cb(`/${r}/`);
    };

    const handleVal = (v) => {
        cb(v);
    };

    let content;
    switch(true) {
    case dataType=='str':
        content = (
            <TextField
                name={name}
                label={name}
                type="text"
                value={input}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                multiline
                rowsMax={10}
                helperText={error}
                error={Boolean(error)}
                {...props}
            />
        );
        break;
    case dataType=='number':
    case dataType=='int':
    case dataType=='uint':
    case dataType=='float':
    case dataType=='utf8':
    case dataType=='raw':
        content = (
            <TextField
                name={name}
                label={name}
                type="text"
                value={input}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                helperText={error}
                error={Boolean(error)}
                placeholder={dataType=='closure'?'example: |x,y| x+y':''}
                {...props}
            />
        );
        break;
    case dataType=='thing':
    case dataType=='set':
        content = (
            <TextField
                margin="dense"
                name={name}
                label={name}
                type="text"
                value={'{ }'}
                fullWidth
                disabled
            />
        );
        break;
    case dataType=='bool':
        content = (
            <AddBool input={`${input}`} cb={handleVal} />
        );
        break;
    case dataType[0]=='[':
        content = (
            <Add1DArray cb={handleArrayItems} type={dataType.slice(1, -1)} />
        );
        break;
    case dataType=='list':
        content = (
            <Add1DArray cb={handleArrayItems} />
        );
        break;
    case dataType=='closure':
        content = (
            <AddClosure input={input} cb={handleVal} />
        );
        break;
    case dataType=='regex':
        content = (
            <AddRegex input={input.trim().slice(1, -1)} cb={handleRegex} />
        );
        break;
    case dataType=='error':
        content = (
            <AddError input={input} cb={handleVal} />
        );
        break;
    case dataType=='bytes':
        content = (
            <AddBlob cb={handleVal} />
        );
        break;
    default:
        content = null;
        break;
    }

    return(
        <React.Fragment>
            {content}
        </React.Fragment>
    );
};

InputField.defaultProps = {
    input: '',
},

InputField.propTypes = {
    dataType: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;