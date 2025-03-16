/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CUSTOM_TYPE_FORMAT_QUERY } from '../../../../TiQueries/Queries';
import { DownloadBlob } from '../..';
import { EditActions, useEdit } from '../Context';
import { THING_KEY } from '../../../../Constants/CharacterKeys';
import { THINGDB_CACHE } from '../../../../Constants/Files';


const AddEnum = ({
    enumName,
    enums,
    identifier = null,
    init = '',
    parent
}: Props) => {
    const [enumMem, setEnumMem] = React.useState('');
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const _enum = (enums || []).find(e => e.name === enumName);
    const isBlob = init.constructor === String && init.includes(THINGDB_CACHE);

    React.useEffect(()=>{
        if (val) {
            let v = identifier === null ? val.slice(enumName.length + 1, -1) : val[identifier].slice(enumName.length + 1, -1) || '';
            setEnumMem(v);
        } else {
            setEnumMem('');
        }
    }, [identifier, val]);

    React.useEffect(()=>{
        if (_enum) {
            const e = init ? (
                init.constructor === Object ? _enum.members.find(i => i[1][THING_KEY] === init[THING_KEY])
                    : _enum.members.find(i => i[1] === init) || _enum.members[0])
                : _enum.members[0];
            setEnumMem(e[0]);
            EditActions.update(dispatch, 'val', CUSTOM_TYPE_FORMAT_QUERY(enumName, e[0]), identifier, parent);
        }
    }, [_enum]);

    const handleChangeEnum = ({target}) => {
        const {value} = target;
        setEnumMem(value);
        EditActions.update(dispatch, 'val', CUSTOM_TYPE_FORMAT_QUERY(enumName, value), identifier, parent);
    };

    return(_enum&&_enum.members?(
        <Grid container>
            <Grid size={3}>
                <TextField
                    fullWidth
                    label="Enum"
                    name="enum"
                    onChange={handleChangeEnum}
                    select
                    slotProps={{select: {native: true}}}
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
                <Grid container size={9}>
                    <Grid container size={12} justifyContent="flex-end">
                        <DownloadBlob val={init} isImg />
                    </Grid>
                    <Grid container size={12} justifyContent="flex-end">
                        <Typography variant="caption">
                            {'Click to download the blob that is currently stored.'}
                        </Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    ) :null);
};

AddEnum.propTypes = {
    enumName: PropTypes.string.isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    parent: PropTypes.string.isRequired,
};

export default AddEnum;

interface Props {
    enumName: string;
    enums: IEnum[];
    identifier: string | number;
    init: any;  // TODOT string | number | IThing | {['#']: number};
    parent: string;
}
