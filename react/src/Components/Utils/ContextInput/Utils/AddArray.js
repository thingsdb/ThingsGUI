import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { EditActions, useEdit } from '../Context';
import { ListHeader } from '../..';
import InputField from '../InputField';


const AddArray = ({childTypes, customTypes, dataTypes, enums, isSet, identifier, parentDispatch}) => {
    const [dataType, setDataType] = React.useState({});
    const [variables, setVariables] = React.useState(['0']);
    const editState = useEdit()[0];

    const {val, blob} = editState;

    React.useEffect(() => {
        let s = Object.values(val);
        EditActions.updateVal(parentDispatch, isSet ? `set([${s}])` : `[${s}]`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    },[blob, identifier, isSet, parentDispatch, val]);

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
    };

    const handleAdd = () => {
        let index = variables.slice(-1)[0] + 1;
        setVariables(variables => {
            let copy = [...variables];
            copy.push(`${index}`);
            return copy;
        });
    };

    const handleDelete = (index) => () => {
        setVariables(variables => {
            let copy = [...variables];
            copy.splice(index, 1);
            return copy;
        });
    };

    // const {array, real, val, blob} = editState;

    // React.useEffect(() => {
    //     let arr = isSet ? `set([${array}])` : `[${array}]`;
    //     EditActions.updateVal(parentDispatch, arr, identifier);
    //     EditActions.updateBlob(parentDispatch, array, blob);
    // }, [array, blob, identifier, isSet, val, parentDispatch]);

    // const handleChange = ({target}) => {
    //     const {value} = target;
    //     setDataType(value);
    //     EditActions.update(dispatch, {val: '', real: {}});
    // };

    // const handleAdd = () => {
    //     parentDispatch(state => (Array.isArray(state.real) ? {real: [...state.real, real]} : {real: [real]}));
    //     EditActions.updateArray(dispatch, `${val}`);
    //     EditActions.update(dispatch, {val: '', real: {}});
    // };

    // const handleRefresh = () => {
    //     EditActions.update(dispatch, {array:  []});
    //     EditActions.update(parentDispatch, {real: []});
    //     EditActions.updateVal(parentDispatch,'[]', identifier);
    // };

    // const handleClick = (index, item) => () => {
    //     EditActions.deleteBlob(dispatch, item);
    //     EditActions.deleteArray(dispatch, index);
    //     parentDispatch((state) => {
    //         let copy = [...state.real];
    //         copy.splice(index, 1);
    //         return {real: copy};
    //     });
    // };

    return (
        <Grid item xs={12}>
            <ListHeader canCollapse onAdd={handleAdd} onDelete={handleDelete} groupSign="[">
                {( variables.map((v, index) => (
                    <Grid key={v} container item xs={12} alignItems="center" sx={{paddingLeft: '48px'}}>
                        {childTypes.length == 1 ? null : (
                            <Grid item xs={4} sx={{paddingRight: '8px'}}>
                                <TextField
                                    fullWidth
                                    id="dataType"
                                    label="Data type"
                                    margin="dense"
                                    name="dataType"
                                    onChange={handleChangeType(v)}
                                    select
                                    SelectProps={{native: true}}
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
                        )}
                        <InputField
                            customTypes={customTypes}
                            dataType={dataType[v]||dataTypes[0]}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            label="Value"
                            variant="standard"
                            identifier={v}
                        />
                        <IconButton color="primary" onClick={handleDelete(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                )))}
            </ListHeader>
        </Grid>
    );
};

AddArray.defaultProps = {
    childTypes: [],
    isSet: false,
    identifier: null,
};

AddArray.propTypes = {
    childTypes: PropTypes.arrayOf(PropTypes.string),
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSet: PropTypes.bool,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddArray;


