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

const AddBool = ({identifier}) => {
    const classes = useStyles();
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, value, identifier);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <RadioGroup className={classes.dense} aria-label="position" name="value" value={`${v}`} onChange={handleOnChange} row>
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
    identifier: null,
},

AddBool.propTypes = {
    identifier: PropTypes.string
};

export default AddBool;