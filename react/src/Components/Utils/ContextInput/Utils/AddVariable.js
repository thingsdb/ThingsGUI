import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import InputField from '../InputField';
import { ListHeader } from '../..';
import { EditActions, useEdit } from '../Context';
import { NIL, STR } from '../../../../Constants/ThingTypes';


const AddVariable = ({variables, customTypes, dataTypes, enums, identifier, parentDispatch}) => {
    const [dataType, setDataType] = React.useState(STR);

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
        if (value == NIL) {
            EditActions.updateVal(dispatch, NIL, v);
        }
    };

    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(dispatch, {
            array:  s,
        });

        EditActions.updateVal(parentDispatch,`{${s}}`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    };

    const handleRefresh = () => {
        EditActions.update(dispatch, {
            array:  [],
        });
        EditActions.updateVal(parentDispatch,'{}', identifier);
    };

    return (
        variables&&(
            <Grid item xs={12}>
                <ListHeader isOpen canCollapse={false} onAdd={handleAdd} onRefresh={handleRefresh} items={array} groupSign="{">
                    {( variables.map(v => (
                        <Grid key={v} container item xs={12} spacing={1} alignItems="center" sx={{paddingLeft: '48px', paddingBottom: '8px'}}>
                            <Grid item xs={12}>
                                <Typography color="primary" variant="body1" >
                                    {v}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
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
                            <Grid item xs={12}>
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
                        </Grid>
                    )))}
                </ListHeader>
            </Grid>
        )
    );
};

AddVariable.defaultProps = {
    identifier: null,
};


AddVariable.propTypes = {
    variables: PropTypes.arrayOf(PropTypes.string).isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddVariable;


