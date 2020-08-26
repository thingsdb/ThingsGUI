/* eslint-disable react-hooks/exhaustive-deps */

import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const TimePicker = ({cb}) => {
    const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [time, setTime] = React.useState(new Date().toISOString().slice(11, 16));

    React.useEffect(() => {
        const timestamp = Date.parse(`${date}T${time}Z`)/1000;
        cb(timestamp);
    },
    [time, date],
    );

    const handleChangeDate = ({target}) => {
        const {value} = target;
        setDate(value);
    };

    const handleChangeTime = ({target}) => {
        const {value} = target;
        setTime(value);
    };

    return (
        <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
                <TextField
                    id="data"
                    label="Date"
                    type="date"
                    defaultValue={date}
                    onChange={handleChangeDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="time"
                    label="Time (UTC)"
                    type="time"
                    defaultValue={time}
                    onChange={handleChangeTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

TimePicker.propTypes = {
    cb: PropTypes.func.isRequired,
};

export default TimePicker;