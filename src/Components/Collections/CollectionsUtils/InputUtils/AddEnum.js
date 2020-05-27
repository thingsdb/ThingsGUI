/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../Context';


const AddEnum = ({enum_, enums, identifier, init}) => {
    const [enumMem, setEnumMem] = React.useState('');
    const dispatch = useEdit()[1];

    React.useEffect(()=>{
        const en = (enums||[]).find(e=>e.name==enum_);
        if (en) {
            const e = init?en.members.find(i=> i[1]==init):en.members[0];
            setEnumMem(e[0]);
            EditActions.updateVal(dispatch, `${enum_}{${e[0]}}`, identifier);
        }
    }, [enums.length]);

    const handleChangeEnum = ({target}) => {
        const {value} = target;
        setEnumMem(value);
        EditActions.updateVal(dispatch, `${enum_}{${value}}`, identifier);
    };

    const en = (enums||[]).find(e=>e.name==enum_);

    return(en&&en.members?(
        <Grid container item xs={3}>
            <TextField
                type="text"
                name="enum"
                label="Enum"
                onChange={handleChangeEnum}
                value={enumMem}
                variant="standard"
                select
                SelectProps={{native: true}}
                fullWidth
            >
                { en.members.map((f, i) => (
                    <option key={i} value={f[0]}>
                        {f[0]}
                    </option>
                ))}
            </TextField>
        </Grid>
    ) :null);
};

AddEnum.defaultProps = {
    identifier: null,
    init: '',
};
AddEnum.propTypes = {
    enum_: PropTypes.string.isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AddEnum;