/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {AutoSelect} from '../../Util';

const AddTypeProperty = ({cb, dropdownItems, input, hasPropName, hasInitVal}) => {
    const {propertyName, propertyType, propertyVal} = input;

    const handleChange = ({target}) => {
        const {name, value} = target;
        cb({...input, [name]: value});
    };

    const handleType = (t) => {
        cb({...input, propertyType: t});
    };

    return (
        <Grid container item xs={12} spacing={1} alignItems="center" >
            {hasPropName ? (
                <Grid item xs={hasInitVal?4:6}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Name"
                        name="propertyName"
                        onChange={handleChange}
                        spellCheck={false}
                        type="text"
                        value={propertyName}
                        variant="standard"

                    />
                </Grid>
            ):null}
            <Grid item xs={hasInitVal?4:6}>
                <AutoSelect cb={handleType} dropdownItems={dropdownItems} input={propertyType} label="Definition" />
            </Grid>
            {hasInitVal ? (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Initial value"
                        name="propertyVal"
                        onChange={handleChange}
                        spellCheck={false}
                        type="text"
                        value={propertyVal}
                        variant="standard"
                        multiline
                    />
                </Grid>
            ) : null}
        </Grid>
    );
};

AddTypeProperty.defaultProps = {
    hasPropName: true,
    hasInitVal: false,
};

AddTypeProperty.propTypes = {
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.shape({propertyName: PropTypes.string.isRequired, propertyType:PropTypes.string.isRequired, propertyVal:PropTypes.string.isRequired}).isRequired,
    hasPropName: PropTypes.bool,
    hasInitVal: PropTypes.bool,
};

export default AddTypeProperty;


