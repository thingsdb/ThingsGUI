/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const timeUnit = [
    {
        label: 'Second',
        value: '1'
    },
    {
        label: 'Minute',
        value: '60'
    },
    {
        label: 'Hour',
        value: '60*60'
    },
    {
        label: 'Day',
        value: '60*60*24'
    },
    {
        label: 'Week',
        value: '60*60*24*7'
    },
];

const TimePeriodPicker = ({onChange}) => {
    const [state, setState] = React.useState({
        number: '1',
        unit: timeUnit[0].value,
    });

    React.useEffect(() => {
        onChange(`${state.number }*${state.unit}`);
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
                    margin="dense"
                    id="number"
                    inputProps={{min: '1'}}
                    type="number"
                    value={state.number}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    margin="dense"
                    id="unit"
                    value={state.unit}
                    onChange={handleOnChange}
                    fullWidth
                    select
                    SelectProps={{native: true}}
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