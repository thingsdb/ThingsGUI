import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    dense: {
        padding: 0,
        margin: 0,
    },
}));

const AddBool = ({input, cb}) => {
    const classes = useStyles();
    const [bool, setBool] = React.useState('');

    React.useEffect(() => {
        cb(bool);
    },
    [bool],
    );

    React.useEffect(() => {
        setBool(input);
    },
    [input],
    );

    const handleOnChange = ({target}) => {
        const {value} = target;
        setBool(value);
    };

    return(
        <RadioGroup className={classes.dense} aria-label="position" name="value" value={bool} onChange={handleOnChange} row>
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