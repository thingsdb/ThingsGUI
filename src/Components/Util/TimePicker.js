import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const TimePicker = ({cb}) => {
    const [time, setTime] = React.useState('');

    React.useEffect(() => {
        cb(time);
    },
    [time],
    );

    const handleOnChange = ({target}) => {
        const {value} = target;
        setTime(value);
    };

    const now = new Date().toISOString().slice(0, 16);

    return (
        <TextField
            id="time"
            label="Time (UTC)"
            type="datetime-local"
            defaultValue={now}
            fullWidth
            onChange={handleOnChange}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

TimePicker.propTypes = {
    cb: PropTypes.func.isRequired,
};

export default TimePicker;