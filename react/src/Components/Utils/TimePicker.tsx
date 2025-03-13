/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';

const TimePicker = ({onChange}: Props) => {
    const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [time, setTime] = React.useState(new Date().toISOString().slice(11, 16));

    React.useEffect(() => {
        const timestamp = Date.parse(`${date}T${time}Z`)/1000;
        onChange(timestamp);
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
        <Grid container size={12} spacing={1}>
            <Grid>
                <TextField
                    defaultValue={date}
                    id="data"
                    label="Date"
                    onChange={handleChangeDate}
                    type="date"
                    variant="standard"
                    slotProps={{inputLabel: {
                        shrink: true,
                    }}}
                />
            </Grid>
            <Grid>
                <TextField
                    defaultValue={time}
                    id="time"
                    label="Time (UTC)"
                    onChange={handleChangeTime}
                    type="time"
                    variant="standard"
                    slotProps={{inputLabel: {
                        shrink: true,
                    }}}
                />
            </Grid>
        </Grid>
    );
};

TimePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default TimePicker;

interface Props {
    onChange: (d: number) => void;
}