import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
        paddingBottom: theme.spacing(1),
    },
}));

const AddVariable = ({variables, customTypes, dataTypes, enums, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState('str');

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    const handleChangeType = (v) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [v]: value});
        if (value == 'nil') {
            EditActions.updateVal(dispatch, 'nil', v);
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
                        <Grid key={v} className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
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
                            <InputField
                                customTypes={customTypes}
                                dataType={dataType[v]||dataTypes[0]}
                                dataTypes={dataTypes}
                                enums={enums}
                                name="Input"
                                variant="standard"
                                label="Value"
                                identifier={v}
                            />
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


