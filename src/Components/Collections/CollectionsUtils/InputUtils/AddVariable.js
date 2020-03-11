/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import InputField from '../InputField';
import {EditActions, useEdit} from '../Context';

const single = [
    'bool',
    'float',
    'int',
    'nil',
    'str',
];

const AddVariable = ({customTypes, dataTypes, identifier, parentDispatch}) => {
    const [dataType, setDataType] = React.useState('str');

    const [editState, dispatch] = useEdit();
    const {blob, val} = editState;

    const convertToRealType = (v, b, t) => {
        console.log(v, b);
        switch(t){
        case 'int':
            if (Number.isNaN(Number.parseInt(v))) {
                return 0;
            }
            return parseInt(v);
        case 'float':
            if (Number.isNaN(Number.parseFloat(v))) {
                return 0;
            }
            return parseFloat(v);
        case 'str': return v.slice(1,-1);
        case 'bytes':
            Object.keys(b).map(k=>{
                v=v.replace(k, b[k]);
                console.log(v)
            });
            return v;
        default: return v;
        }
    };

    React.useEffect(() => {
        const v = convertToRealType(val, blob, dataType);
        EditActions.updateVal(parentDispatch, v, identifier);
    },[val]);


    const handleChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
        EditActions.updateVal(dispatch, '');
    };

    return (
        <Grid container item xs={12} spacing={1} alignItems="center" >
            <Grid item xs={12}>
                <Typography color="primary" variant="body1" >
                    {identifier}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="dataType"
                    type="text"
                    name="dataType"
                    label="Data type"
                    onChange={handleChangeType}
                    value={dataType}
                    variant="standard"
                    select
                    SelectProps={{native: true}}
                    fullWidth
                >
                    {dataTypes.map( p => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={single.includes(dataType)?6:12}>
                <InputField
                    customTypes={customTypes}
                    dataType={dataType}
                    dataTypes={dataTypes}
                    name="Input"
                    variant="standard"
                    label="Value"
                />
            </Grid>
        </Grid>
    );
};

AddVariable.defaultProps = {
    identifier: null,
};


AddVariable.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddVariable;


