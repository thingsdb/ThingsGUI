import DeleteIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ARRAY, STR } from '../../../../Constants/ThingTypes';
import { CollectionActions } from '../../../../Stores';
import { CURLY_BRACKETS_FORMAT_QUERY } from '../../../../TiQueries/Queries';
import { EditActions, useEdit } from '../Context';
import { ListHeader, useDebounce } from '../..';
import InputField from '../InputField';


const AddThing = ({
    customTypes,
    dataTypes,
    enums,
    identifier = null,
    parent,
    parentDispatch,
}: Props) => {
    const [dataType, setDataType] = React.useState([STR]);
    const [property, setProperty] = React.useState(['']);
    const [editState, dispatch] = useEdit();
    const {blob, obj, val} = editState;

    const updateContext = React.useCallback(() => {
        let array = (val || []).map((v, index) => `${property[index]}: ${v}`);
        let o = property.reduce((res, k, i) => ({ ...res, [k]: obj[i]}), {});
        EditActions.update(parentDispatch, 'val', CURLY_BRACKETS_FORMAT_QUERY(array), identifier, parent);
        EditActions.update(parentDispatch, 'obj', o, identifier, parent);
        EditActions.updateBlob(parentDispatch, val, blob);
        CollectionActions.enableSubmit();
    }, [blob, identifier, obj, property, parent, parentDispatch, val]);

    const [updateContextDebounced] = useDebounce(updateContext, 200);

    React.useEffect(() => {
        CollectionActions.disableSubmit();
        updateContextDebounced();
    }, [updateContextDebounced]);

    const handleChangeProperty = (index) => ({target}) => {
        const {value} = target;
        setProperty(prev => {
            let copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const handleChangeType = (index) => ({target}) => {
        const {value} = target;
        setDataType(prev => {
            let copy = [...prev];
            copy[index] = value;
            return copy;
        });
        dispatch(prev => {
            let copy = [...prev.val];
            copy[index] = '';
            return {val: copy};
        });
    };

    const handleAdd = () => {
        setDataType(prev => {
            let copy = [...prev];
            copy.push(STR);
            return copy;
        });
        setProperty(prev => {
            let copy = [...prev];
            copy.push('');
            return copy;
        });
    };

    const handleDelete = (index) => () => {
        setDataType(prev => {
            let copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
        setProperty(prev => {
            let copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
        dispatch(prev => {
            let copy = [...prev.val];
            copy.splice(index, 1);
            return {val: copy};
        });
    };

    return (
        <Grid size={12}>
            <ListHeader canCollapse onAdd={handleAdd} groupSign="{">
                {( property.map((p, index) => (
                    <Grid key={index} container size={12} alignItems="center" sx={{paddingLeft: '32px'}} >
                        <Grid size={3} sx={{paddingRight: '8px'}}>
                            <TextField
                                fullWidth
                                id="property"
                                label="Property"
                                margin="dense"
                                name="property"
                                onChange={handleChangeProperty(index)}
                                type="text"
                                value={p}
                                variant="standard"
                            />
                        </Grid>
                        <Grid size={3} sx={{paddingRight: '8px'}}>
                            <TextField
                                fullWidth
                                id="dataType"
                                label="Data type"
                                margin="dense"
                                name="dataType"
                                onChange={handleChangeType(index)}
                                select
                                slotProps={{select: {native: true}}}
                                type="text"
                                value={dataType[index] || STR}
                                variant="standard"
                            >
                                {dataTypes.map( p => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid container size={6} justifyContent="flex-end">
                            <IconButton color="primary" onClick={handleDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        <InputField
                            customTypes={customTypes}
                            dataType={dataType[index] || STR}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            identifier={index}
                            label="Value"
                            name="Input"
                            parent={ARRAY}
                            variant="standard"
                        />
                    </Grid>
                )))}
            </ListHeader>
        </Grid>
    );
};

AddThing.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parent: PropTypes.string.isRequired,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddThing;


interface Props {
    customTypes: object[];
    dataTypes: string[];
    enums: object[];
    identifier: string | number;
    parent: string;
    parentDispatch: any;
}
