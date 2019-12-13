import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {AutoSelect} from '../../Util';

const AddTypeProperty = ({cb, dropdownItems, input, hasPropName, hasInitVal}) => {
    const [state, setState] = React.useState({
        propertyName: '',
        propertyType: dropdownItems[0],
        propertyVal: '',
    });
    const {propertyName, propertyType, propertyVal} = state;

    React.useEffect(() => {
        if (Object.keys(input).length>1&&(input.propertyName!=state.propertyName || input.propertyType!=state.propertyType)) {
            setState({
                propertyName: input.propertyName,
                propertyType: input.propertyType,
                propertyVal: '',
            });
        }
    },
    [input.propertyName, input.propertyType],
    );

    React.useEffect(() => {
        cb(state);
    },
    [state.propertyName, state.propertyType, state.propertyVal],
    );

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value});
    };

    const handleType = (t) => {
        setState({...state, propertyType: t});
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
                        variant="outlined"

                    />
                </Grid>
            ):null}
            <Grid item xs={hasInitVal?4:6}>
                <AutoSelect cb={handleType} dropdownItems={dropdownItems} input={propertyType} label="Definition" />
            </Grid>
            {hasInitVal ? (
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Initial value"
                        name="propertyVal"
                        onChange={handleChange}
                        spellCheck={false}
                        type="text"
                        value={propertyVal}
                        variant="outlined"
                    />
                </Grid>
            ) : null}
        </Grid>
    );
};

AddTypeProperty.defaultProps = {
    input: {},
    hasPropName: true,
    hasInitVal: false,
};

AddTypeProperty.propTypes = {
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.object,
    hasPropName: PropTypes.bool,
    hasInitVal: PropTypes.bool,
};

export default AddTypeProperty;


