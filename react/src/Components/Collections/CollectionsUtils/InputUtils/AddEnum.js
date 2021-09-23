/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {EditActions, useEdit} from '../Context';
import {DownloadBlob} from '../../../Util';
import {THING_KEY} from '../../../../Constants/CharacterKeys';
import {THINGDB_CACHE} from '../../../../Constants/Files';


const AddEnum = ({enumName, enums, identifier, init}) => {
    const [enumMem, setEnumMem] = React.useState('');
    const dispatch = useEdit()[1];

    const _enum = (enums || []).find(e => e.name === enumName);
    const isBlob = init.constructor === String && init.includes(THINGDB_CACHE);

    React.useEffect(()=>{
        if (_enum) {
            const e = init ? (init.constructor === Object ? _enum.members.find(i => i[1][THING_KEY] === init[THING_KEY]) : _enum.members.find(i => i[1] === init) || _enum.members[0])
                : _enum.members[0];
            setEnumMem(e[0]);
            EditActions.updateVal(dispatch, `${enumName}{${e[0]}}`, identifier);
        }
    }, [_enum]);

    const handleChangeEnum = ({target}) => {
        const {value} = target;
        setEnumMem(value);
        EditActions.updateVal(dispatch, `${enumName}{${value}}`, identifier);
    };

    return(_enum&&_enum.members?(
        <Grid container>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    label="Enum"
                    name="enum"
                    onChange={handleChangeEnum}
                    select
                    SelectProps={{native: true}}
                    type="text"
                    value={enumMem}
                    variant="standard"
                >
                    { _enum.members.map((f, i) => (
                        <option key={i} value={f[0]}>
                            {f[0]}
                        </option>
                    ))}
                </TextField>
            </Grid>
            {isBlob&&
                <Grid container item xs={9}>
                    <Grid container item xs={12} justifyContent="flex-end">
                        <DownloadBlob val={init} isImg />
                    </Grid>
                    <Grid container item xs={12} justifyContent="flex-end">
                        <Typography variant="caption">
                            {'Click to download the blob that is currently stored.'}
                        </Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    ) :null);
};

AddEnum.defaultProps = {
    identifier: null,
    init: '',
};
AddEnum.propTypes = {
    enumName: PropTypes.string.isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
};

export default AddEnum;