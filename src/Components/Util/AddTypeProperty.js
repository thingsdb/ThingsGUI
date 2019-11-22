import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


const AddTypeProperty = ({cb, dropdownItems, input, hasPropName, hasInitVal}) => {
    const [state, setState] = React.useState({
        propertyName: '',
        propertyType: dropdownItems[0],
        propertyVal: '',
    });
    const {propertyName, propertyType, propertyVal} = state;

    React.useEffect(() => {
        cb(state);
    },
    [state.propertyName, state.propertyType, state.propertyVal],
    );

    React.useEffect(() => {
        if (input.length) {
            setState(input);
        }
    },
    [input.propertyName, input.propertyType, input.propertyVal],
    );

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value});
    };

    return (
        <Grid container item xs={12} spacing={1} alignItems="center" >
            {hasPropName ? (
                <Grid item>
                    <TextField
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
            <Grid item>
                <TextField
                    fullWidth
                    id="propertyType"
                    label="Type"
                    name="propertyType"
                    onChange={handleChange}
                    select
                    SelectProps={{native: true}}
                    type="text"
                    value={propertyType}
                    variant="outlined"
                >
                    {dropdownItems.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </TextField>
            </Grid>
            {hasInitVal ? (
                <Grid item>
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


