import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';
import {NIL, STR} from '../../../../Constants/ThingTypes';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
    },
}));


const AddThing = ({customTypes, dataTypes, enums, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        dataType: STR,
        property: '',
    });
    const {dataType, property} = state;

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        let arr = `{${array}}`;
        EditActions.updateVal(parentDispatch, arr, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },
    [array, blob, identifier, parentDispatch],
    );

    const handleChangeProperty = ({target}) => {
        const {value} = target;
        setState({...state, property: value});
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setState({...state, dataType: value});
        EditActions.updateVal(dispatch, '');
    };

    const typeControls = (type, input) => {
        return type === NIL ? `${input} ${NIL}`
            : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, `${property}: ${val}`);
        EditActions.addToArr(dispatch, contentTypeChecked);
    };

    const handleRefresh = () => {
        EditActions.update(dispatch, {
            array:  [],
        });
        EditActions.updateVal(parentDispatch,'{}', identifier);
    };

    const handleClick = (index, item) => () => {
        EditActions.deleteBlob(dispatch, item);
        EditActions.deleteFromArr(dispatch, index);
    };

    return (
        <Grid item xs={12}>
            <ListHeader canCollapse onAdd={handleAdd} onDelete={handleClick} onRefresh={handleRefresh} items={array} groupSign="{">
                <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
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
                        name="Input"
                        variant="standard"
                        label="Value"
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


