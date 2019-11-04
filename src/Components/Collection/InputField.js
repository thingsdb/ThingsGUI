import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import {Add1DArray, AddBlob, AddBool, checkType, onlyNums} from '../Util';

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: 0,
        marginBottom: 0,
    },
}));

const InputField = ({dataType, cb, name, input, ...props}) => {
    const classes = useStyles();
    const [val, setVal] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        cb(val);
    },
    [val],
    );

    React.useEffect(() => {
        if (input != null) {
            setVal(input);
        }
    },
    [input, dataType],
    );

    const errorTxt = (value) => {
        const bool = value.length>0;
        let errText = bool?'':'is required';
        switch (dataType) {
        case 'number':
            if (bool) {
                errText = onlyNums(value) ? '' : 'only numbers';
            }
            return(errText);
        case 'closure':
            if (bool) {
                errText = /^((?:\|[a-zA-Z\s]*(?:[,][a-zA-Z\s]*)*\|)|(?:\|\|))(?:(?:[\s]|[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>])*[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>]+)$/.test(value) ? '':'closure is not valid';
            }
            return(errText);
        default:
            return '';
        }
    };


    const handleOnChange = ({target}) => {
        const {value} = target;
        setVal(value);
        const err = errorTxt(value);
        setError(err);
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        setVal(value);
    };

    const handleBlob = (blob) => {
        setVal(blob);
    };

    const handleBool = (bool) => {
        setVal(bool);
    };

    const singleInputField = dataType == 'number' || dataType == 'string';
    const multiInputField = dataType == 'array';
    const booleanInputField = dataType == 'boolean';
    const blobInputField = dataType == 'blob';
    const closureInputField = dataType == 'closure';

    return(
        <React.Fragment>
            {singleInputField ? (
                <TextField
                    className={classes.textField}
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    helperText={error}
                    error={Boolean(error)}
                    {...props}
                />
            ) : multiInputField ? (
                <Add1DArray cb={handleArrayItems} />
            ) : booleanInputField ? (
                <AddBool input={checkType(input) == 'boolean' ?  `${input}` : ''} cb={handleBool} />
            ) : blobInputField ? (
                <AddBlob cb={handleBlob} {...props} />
            ) : closureInputField ? (
                <TextField
                    className={classes.textField}
                    margin="dense"
                    name={name}
                    label={name}
                    type="text"
                    value={val}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    placeholder="example: |x,y| x+y"
                    helperText={error}
                    error={Boolean(error)}
                    {...props}
                />
            ) : null }
        </React.Fragment>
    );
};

InputField.defaultProps = {
    input: null,
},

InputField.propTypes = {
    dataType: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    input: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default InputField;