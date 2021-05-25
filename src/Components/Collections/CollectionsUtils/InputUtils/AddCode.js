/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';


const AddCode = ({identifier, init, label, link, numLines}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        EditActions.updateVal(dispatch, init, identifier);
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.updateVal(dispatch, value, identifier);
    };

    const v = val[identifier]||(val.constructor === Object?'':val);

    return(
        <TextField
            name="value"
            type="text"
            value={v}
            spellCheck={false}
            onChange={handleOnChange}
            fullWidth
            multiline
            rows={numLines}
            rowsMax="10"
            variant="standard"
            label={label}
            margin="dense"
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