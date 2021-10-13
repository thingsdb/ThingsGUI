import DeleteIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ARRAY, STR } from '../../../../Constants/ThingTypes';
import { CollectionActions } from '../../../../Stores';
import { EditActions, useEdit } from '../Context';
import { ListHeader, useDebounce } from '../..';
import InputField from '../InputField';


const AddThing = ({customTypes, dataTypes, enums, identifier, parent, parentDispatch}) => {
    const [dataType, setDataType] = React.useState([STR]);
    const [property, setProperty] = React.useState(['']);
    const [editState, dispatch] = useEdit();
    const {val, blob} = editState;

    const updateContext = React.useCallback(() => {
        let array = (val || []).map((v, index) => `${property[index]}: ${v}`);
        EditActions.update(parentDispatch, 'val', `{${array}}`, identifier, parent);
        EditActions.updateBlob(parentDispatch, val, blob);
        CollectionActions.enableSubmit();
    }, [blob, identifier, property, parent, parentDispatch, val]);

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
        dispatch((state) => {
            let cVal = [...state.val];
            cVal.splice(index, 1);
            return {val: cVal};
        });
    };

    return (
        <Grid item xs={12}>
            <ListHeader canCollapse onAdd={handleAdd} groupSign="{">
                {( property.map((p, index) => (
                    <Grid key={index} container item xs={12} alignItems="center" sx={{paddingLeft: '32px'}} >
                        <Grid item xs={3} sx={{paddingRight: '8px'}}>
                            <TextField
                                autoFocus
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
                        <Grid item xs={3} sx={{paddingRight: '8px'}}>
                            <TextField
                                fullWidth
                                id="dataType"
                                label="Data type"
                                margin="dense"
                                name="dataType"
                                onChange={handleChangeType(index)}
                                select
                                SelectProps={{native: true}}
                                type="text"
                                value={dataType[index] || dataTypes[0]}
                                variant="standard"
                            >
                                {dataTypes.map( p => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid container item xs={6} justifyContent="flex-end">
                            <IconButton color="primary" onClick={handleDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        <InputField
                            customTypes={customTypes}
                            dataType={dataType[index] || dataTypes[0]}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            identifier={index}
                            label="Value"
                            name="Input"
                            variant="standard"
                            parent={ARRAY}
                        />
                    </Grid>
                )))}
            </ListHeader>
        </Grid>
    );
};

AddThing.defaultProps = {
    identifier: null,
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


