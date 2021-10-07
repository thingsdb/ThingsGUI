import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import InputField from '../InputField';
import { ListHeader } from '../..';
import { EditActions, useEdit } from '../Context';
import { STR } from '../../../../Constants/ThingTypes';


const AddThing = ({customTypes, dataTypes, enums, identifier, parentDispatch}) => {
    const [dataType, setDataType] = React.useState(STR);
    const [property, setProperty] = React.useState('');

    const [editState, dispatch] = useEdit();
    const {array, real, val, blob} = editState;

    React.useEffect(() => {
        EditActions.updateVal(parentDispatch, `{${array}}`, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    }, [array, blob, identifier, parentDispatch]);

    const handleChangeProperty = ({target}) => {
        const {value} = target;
        setProperty(value);
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
        EditActions.update(dispatch, {val: '', real: {}});
    };

    const handleAdd = () => {
        parentDispatch( state => (typeof state.real === 'object' ? {real: {...state.real, [property]: real}} : {real: {[property]: real}}));
        EditActions.updateArray(dispatch, `${property}: ${val}`);
        EditActions.update(dispatch, {val: '', real: {}});
        setProperty('');
    };

    const handleRefresh = () => {
        EditActions.update(dispatch, {array: []});
        EditActions.update(parentDispatch, {real: {}});
        EditActions.updateVal(parentDispatch,'{}', identifier);
    };

    const handleClick = (index, item) => () => {
        EditActions.deleteBlob(dispatch, item);
        EditActions.deleteArray(dispatch, index);
        parentDispatch((state) => {
            let copy = {...state.real};
            let k = Object.keys(copy).find(i=>item.includes(i));
            delete copy[k];
            return {real: copy};
        });
    };

    return (
        <Grid item xs={12}>
            <ListHeader canCollapse onAdd={handleAdd} onDelete={handleClick} onRefresh={handleRefresh} items={array} groupSign="{">
                <Grid container item xs={12} alignItems="center" sx={{paddingLeft: '48px'}}>
                    <Grid item xs={3} sx={{paddingRight: '8px'}}>
                        <TextField
                            autoFocus
                            fullWidth
                            id="property"
                            label="Property"
                            margin="dense"
                            name="property"
                            onChange={handleChangeProperty}
                            type="text"
                            value={property}
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
                            onChange={handleChangeType}
                            select
                            SelectProps={{native: true}}
                            type="text"
                            value={dataType}
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
                        dataType={dataType}
                        dataTypes={dataTypes}
                        enums={enums}
                        fullWidth
                        label="Value"
                        name="Input"
                        variant="standard"
                    />
                </Grid>
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
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddThing;


