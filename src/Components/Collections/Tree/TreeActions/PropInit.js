/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const Edit = ({cb, thing}) => {
    const [newProperty, setNewProperty] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(()=>{
        cb(newProperty);
    }, [newProperty]);

    const errorTxt = (property) => thing[property] ? 'property name already in use' : '';

    const handleOnChangeName = ({target}) => {
        const {value} = target;
        const err = errorTxt(value);
        setError(err);
        setNewProperty(value);
    };

    return(
        <TextField
            margin="dense"
            name="newProperty"
            label="New property"
            type="text"
            value={newProperty}
            spellCheck={false}
            onChange={handleOnChangeName}
            helperText={error}
            error={Boolean(error)}
        />
    )
};

Edit.defaultProps = {
    thing: null,
},

Edit.propTypes = {
    cb: PropTypes.func.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default Edit;