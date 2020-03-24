/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    fullWidth: {
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(6),
        paddingBottom: theme.spacing(1),
    },
}));

const single = [
    'bool',
    'float',
    'int',
    'nil',
    'str',
];

const AddVariable = ({variables, customTypes, dataTypes, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState('str');
    const [open, setOpen] = React.useState(false);

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;


    React.useEffect(() => {
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
    },
    [JSON.stringify(variables)],
    );

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
        if (value == 'nil') {
            EditActions.updateVal(dispatch, 'nil', v);
        } else {
            EditActions.updateVal(dispatch, '', v);
        }
    };

    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(dispatch, {
            array:  s,
        });

        // const v = convertToRealType(val, blob, dataType);
        EditActions.updateVal(parentDispatch,`{${s}}`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    };

    return (

        <React.Fragment>
            {variables&&(
                <Grid container>
                    <ListHeader onAdd={handleAdd} items={array} groupSign="{">
                        <React.Fragment>
                            {( variables.map(v => (
                                <Grid key={v} className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
                                    <Grid item xs={12}>
                                        <Typography color="primary" variant="body1" >
                                            {v}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="dataType"
                                            type="text"
                                            name="dataType"
                                            label="Data type"
                                            onChange={handleChangeType(v)}
                                            value={dataType[v]||dataTypes[0]}
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
                                    <Grid item xs={single.includes(dataType[v]||dataTypes[0])?6:12}>
                                        <InputField
                                            customTypes={customTypes}
                                            dataType={dataType[v]||dataTypes[0]}
                                            dataTypes={dataTypes}
                                            name="Input"
                                            variant="standard"
                                            label="Value"
                                            identifier={v}
                                        />
                                    </Grid>
                                </Grid>
                            )))}
                        </React.Fragment>
                    </ListHeader>
                </Grid>
            )}
        </React.Fragment>
    );
};

AddVariable.defaultProps = {
    identifier: null,
};


AddVariable.propTypes = {
    variables: PropTypes.arrayOf(PropTypes.string).isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddVariable;


