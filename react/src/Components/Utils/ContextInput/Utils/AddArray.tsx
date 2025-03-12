import DeleteIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ARRAY, STR } from '../../../../Constants/ThingTypes';
import { CollectionActions } from '../../../../Stores';
import { EditActions, useEdit } from '../Context';
import { ListHeader, useDebounce } from '../..';
import { SET_FORMAT_QUERY } from '../../../../TiQueries/Queries';
import InputField from '../InputField';


const AddArray = ({
    childTypes = [],
    customTypes,
    dataTypes,
    enums,
    isSet = false,
    identifier = null,
    parent,
    parentDispatch,
}: Props) => {
    const [dataType, setDataType] = React.useState([childTypes.length ? childTypes[0] : STR]);
    const [editState, dispatch] = useEdit();
    const {blob, obj, val} = editState;

    const updateContext = React.useCallback(() => {
        EditActions.update(parentDispatch, 'val', isSet ? SET_FORMAT_QUERY(`[${val}]`) : `[${val}]`, identifier, parent);
        EditActions.update(parentDispatch, 'obj', obj, identifier, parent);
        EditActions.updateBlob(parentDispatch, val, blob);
        CollectionActions.enableSubmit();
    }, [blob, identifier, isSet, obj, parent, parentDispatch, val]);

    const [updateContextDebounced] = useDebounce(updateContext, 200);

    React.useEffect(() => {
        CollectionActions.disableSubmit();
        updateContextDebounced();
    }, [updateContextDebounced]);

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
            copy.push(childTypes.length ? childTypes[0] : STR );
            return copy;
        });
    };

    const handleDelete = (index) => () => {
        setDataType(prev => {
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
            <ListHeader canCollapse onAdd={handleAdd} groupSign="[">
                {( dataType.map((d, index) => (
                    <Grid key={index} container size={12} alignItems="center" sx={{paddingLeft: '32px'}}>
                        {
                            <Grid size={4} sx={{paddingRight: '8px'}}>
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
                                    value={d}
                                    variant="standard"
                                >
                                    {(childTypes.length ? childTypes : dataTypes).map( p => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        }
                        <Grid container size={8} justifyContent="flex-end">
                            <IconButton color="primary" onClick={handleDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        <InputField
                            customTypes={customTypes}
                            dataType={d}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            identifier={index}
                            label="Value"
                            parent={ARRAY}
                            variant="standard"
                        />
                    </Grid>
                )))}
            </ListHeader>
        </Grid>
    );
};

AddArray.propTypes = {
    childTypes: PropTypes.arrayOf(PropTypes.string),
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isSet: PropTypes.bool,
    parent: PropTypes.string.isRequired,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddArray;


interface Props {
    [index: string]: any;
}
