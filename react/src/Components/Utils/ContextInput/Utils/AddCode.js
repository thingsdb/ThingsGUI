/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../Context';


const AddCode = ({identifier, init, label, link, numLines}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
        EditActions.updateReal(dispatch, init);
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, value, identifier);
        EditActions.updateReal(dispatch, value);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            fullWidth
            label={label}
            margin="dense"
            maxRows="10"
            minRows={numLines}
            multiline
            name="value"
            onChange={handleOnChange}
            spellCheck={false}
            type="text"
            value={v}
            variant="standard"
            helperText={
                <Link target="_blank" href={link}>
                    {'ThingsDocs'}
                </Link>
            }
        />
    );
};

AddCode.defaultProps = {
    identifier: null,
    init:'',
},

AddCode.propTypes = {
    identifier: PropTypes.string,
    /* eslint-disable react/forbid-prop-types */
    init: PropTypes.any,
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    numLines: PropTypes.string.isRequired,
};

export default AddCode;