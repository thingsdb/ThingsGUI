import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    dense: {
        padding: theme.spacing(1),
        margin: 0,
    },
}));

const AddBool = ({input, cb}) => {
    const classes = useStyles();

    const handleOnChange = ({target}) => {
        const {value} = target;
        cb(value);
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

AddBool.defaultProps = {
    input: '',
};

AddBool.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.string,
};

export default AddBool;