import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

import {EditActions, useEdit} from '../TreeActions/Context';

const useStyles = makeStyles(theme => ({
    dense: {
        padding: theme.spacing(1),
        margin: 0,
    },
}));

const AddBool = ({name}) => {
    const classes = useStyles();
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, {
            val: {...val, [name]: value},
        });
    };

    return(
        <RadioGroup className={classes.dense} aria-label="position" name="value" value={`${val[name]?val[name]:''}`} onChange={handleOnChange} row>
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

AddBool.propTypes = {
    name: PropTypes.string.isRequired,
};

export default AddBool;