/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';


const AddEnum = ({enum_, enums, identifier}) => {
    // const [enumMem, setEnumMem] = React.useState('');
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        const v = val[identifier]||(val.constructor === Object?'':val);
        EditActions.updateVal(dispatch, `${enum_}{${v}}`, identifier);
    }, []);

    const handleChangeEnum = ({target}) => {
        const {value} = target;
        // setEnumMem(value);
        EditActions.updateVal(dispatch, `${enum_}{${value}}`, identifier);
    };

    const en = (enums||[]).find(e=>e.name==enum_);
    const v = val[identifier]||(val.constructor === Object?'':val);
    const i1 = v.indexOf('{', 0);
    const i2 = v.indexOf('}', 0);
    let e = i1==-1&&i2==-1?v.slice(i1, i2): v;

    return(en&&en.members?(
        <Grid container item xs={3}>
            <TextField
                type="text"
                name="enum"
                label="Enum"
                onChange={handleChangeEnum}
                value={e}
                variant="standard"
                select
                SelectProps={{native: true}}
                fullWidth
            >
                { en.members.map(([fprop, fval], i) => (
                    <option key={i} value={fprop}>
                        {fprop}
                    </option>
                ))}
            </TextField>
        </Grid>
    ) :null);
};

AddEnum.defaultProps = {
    identifier: null,
};
AddEnum.propTypes = {
    enum_: PropTypes.string.isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.string,
};

export default AddEnum;