/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const timeUnit = [
    {
        label: 'Second',
        value: 1
    },
    {
        label: 'Minute',
        value: 60
    },
    {
        label: 'Hour',
        value: 3600
    },
    {
        label: 'Day',
        value: 86400
    },
    {
        label: 'Week',
        value: 604800
    },
];

const TimePeriodPicker = ({onChange}) => {
    const [state, setState] = React.useState({
        number: '1',
        unit: timeUnit[0].value,
    });

    React.useEffect(() => {
        onChange(Number(state.number * state.unit));
    },
    [state.number, state.unit],
    );

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState({...state, [id]: value});
    };

    return (
        <Grid item container xs={12} spacing={1} >
            <Grid item>
                <TextField
                    autoFocus
                    fullWidth
                    id="number"
                    inputProps={{min: '1'}}
                    margin="dense"
                    onChange={handleOnChange}
                    spellCheck={false}
                    type="number"
                    value={state.number}
                    variant="standard"
                />
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    id="unit"
                    margin="dense"
                    onChange={handleOnChange}
                    select
                    SelectProps={{native: true}}
                    value={state.unit}
                    variant="standard"
                >
                    {timeUnit.map(({label, value}) => (
                        <option key={label} value={value}>
                            {label}
                        </option>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

TimePeriodPicker.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default TimePeriodPicker;