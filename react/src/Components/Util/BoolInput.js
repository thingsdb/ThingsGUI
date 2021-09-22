import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    dense: {
        padding: theme.spacing(1),
        margin: 0,
    },
}));

const BoolInput = ({input, onChange}) => {
    const classes = useStyles();

    const handleOnChange = ({target}) => {
        const {value} = target;
        onChange(value);
    };

    return(
        <RadioGroup className={classes.dense} aria-label="position" name="value" value={input} onChange={handleOnChange} row>
            <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="true"
                labelPlacement="end"
            />
            <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="false"
                labelPlacement="end"
            />
        </RadioGroup>
    );
};

BoolInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default BoolInput;