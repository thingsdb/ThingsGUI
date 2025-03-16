/*eslint-disable react/jsx-props-no-spreading*/
/* eslint-disable react-hooks/exhaustive-deps */
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {EditActions, useEdit} from '../Context';


const AddCode = ({
    identifier = null,
    init = '',
    label,
    link,
    numLines,
    parent,
}: Props) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
        }
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, 'val', value, identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

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

AddCode.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /* eslint-disable react/forbid-prop-types */
    init: PropTypes.any,
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    numLines: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
};

export default AddCode;

interface Props {
    identifier: string | number;
    init?: string;
    label: string;
    link: string;
    numLines: string;
    parent: string;
}
