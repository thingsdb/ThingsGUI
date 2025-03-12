import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CollectionActions } from '../../../../Stores';
import { CURLY_BRACKETS_FORMAT_QUERY } from '../../../../TiQueries/Queries';
import { EditActions, useEdit } from '../Context';
import InputField from '../InputField';
import useDebounce from '../../useDebounce';


const AddVariable = ({
    variables,
    customTypes,
    dataTypes,
    enums,
    identifier = null,
    parent,
    parentDispatch
}: Props) => {
    const [dataType, setDataType] = React.useState({});
    const [editState, dispatch] = useEdit();
    const {blob, obj, val} = editState;

    const updateContext = React.useCallback(() => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(parentDispatch, 'val', CURLY_BRACKETS_FORMAT_QUERY(s), identifier, parent);
        EditActions.update(parentDispatch, 'obj', obj, identifier, parent);
        EditActions.updateBlob(parentDispatch, s, blob);
        CollectionActions.enableSubmit();
    }, [blob, identifier, obj, parent, parentDispatch, val]);

    const [updateContextDebounced] = useDebounce(updateContext, 200);

    React.useEffect(() => {
        CollectionActions.disableSubmit();
        updateContextDebounced();
    }, [updateContextDebounced]);

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
        dispatch(prev => {
            let copy = {...prev.val};
            copy[v] = '';
            return {val: copy};
        });
    };

    return (
        variables&&(
            <Grid size={12}>
                {( variables.map(v => (
                    <Grid key={v} container size={12} alignItems="center" sx={{paddingBottom: '8px'}}>
                        <Grid size={12}>
                            <Typography color="primary" variant="body1" >
                                {v}
                            </Typography>
                        </Grid>
                        <Grid size={3} sx={{paddingRight: '8px'}}>
                            <TextField
                                fullWidth
                                id="dataType"
                                label="Data type"
                                margin="dense"
                                name="dataType"
                                onChange={handleChangeType(v)}
                                select
                                slotProps={{select: {native: true}}}
                                type="text"
                                value={dataType[v]||dataTypes[0]}
                                variant="standard"
                            >
                                {dataTypes.map( p => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <InputField
                            customTypes={customTypes}
                            dataType={dataType[v]||dataTypes[0]}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            identifier={v}
                            label="Value"
                            name="Input"
                            variant="standard"
                        />
                    </Grid>
                )))}
            </Grid>
        )
    );
};

AddVariable.propTypes = {
    variables: PropTypes.arrayOf(PropTypes.string).isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parent: PropTypes.string.isRequired,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddVariable;


interface Props {
    variables: string[];
    customTypes: object[];
    dataTypes: string[];
    enums: object[];
    identifier: string | number;
    parent: string;
    parentDispatch: any;
}
