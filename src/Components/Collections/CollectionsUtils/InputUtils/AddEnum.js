/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {EditActions, useEdit} from '../Context';
import {DownloadBlob} from '../../../Util';


const AddEnum = ({enumName, enums, identifier, init}) => {
    const [enumMem, setEnumMem] = React.useState('');
    const dispatch = useEdit()[1];

    const _enum = (enums || []).find(e => e.name === enumName);
    const isBlob = init.constructor === String && init.includes('/download/tmp/thingsdb-cache');

    React.useEffect(()=>{
        if (_enum) {
            const e = init ? (init.constructor === Object ? _enum.members.find(i => i[1]['#'] === init['#']) : _enum.members.find(i => i[1] === init) || _enum.members[0])
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
                    { _enum.members.map((f, i) => (
                        <option key={i} value={f[0]}>
                            {f[0]}
                        </option>
                    ))}
                </TextField>
            </Grid>
            {isBlob&&
                <Grid container item xs={9}>
                    <Grid container item xs={12} justify="flex-end">
                        <DownloadBlob val={init} isImg />
                    </Grid>
                    <Grid container item xs={12} justify="flex-end">
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