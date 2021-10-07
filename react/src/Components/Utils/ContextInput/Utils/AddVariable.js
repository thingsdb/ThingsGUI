import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import InputField from '../InputField';
import { EditActions, useEdit } from '../Context';


const AddVariable = ({variables, customTypes, dataTypes, enums, identifier, parentDispatch}) => {
    const [dataType, setDataType] = React.useState({});
    const editState = useEdit()[0];
    const {val, blob} = editState;

    React.useEffect(() => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.updateVal(parentDispatch,`{${s}}`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    },[blob, identifier, parentDispatch, val]);

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
    };

    return (
        variables&&(
            <Grid item xs={12}>
                {( variables.map(v => (
                    <Grid key={v} container item xs={12} alignItems="center" sx={{paddingBottom: '8px'}}>
                        <Grid item xs={12}>
                            <Typography color="primary" variant="body1" >
                                {v}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{paddingRight: '8px'}}>
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


