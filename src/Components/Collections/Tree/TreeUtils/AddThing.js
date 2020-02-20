/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import InputField from '../TreeActions/InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../TreeActions/Context';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
    },
}));

const single = [
    'bool',
    'float',
    'int',
    'nil',
    'str',
];

const AddThing = ({customTypes, dataTypes, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        dataType: 'str',
        property: '',
    });
    const {dataType, property} = state;

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
    },
    [],
    );

    React.useEffect(() => {
        EditActions.updateVal(parentDispatch,`{${array}}`, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },
    [array.length],
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
        return type === 'nil' ? `${input} nil`
            : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, `${property}: ${val}`);
        EditActions.addToArr(dispatch, contentTypeChecked);
        EditActions.updateVal(dispatch, '');
        setState({...state, property: ''});
    };

    const handleClick = (index, item) => () => {
        EditActions.deleteBlob(dispatch, item);
        EditActions.deleteFromArr(dispatch, index);
    };

    return (
        <Grid container>
            <ListHeader onAdd={handleAdd} onDelete={handleClick} items={array} groupSign="{">
                <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
                    <Grid item xs={3}>
                        <TextField
                            id="property"
                            type="text"
                            name="property"
                            label="Property"
                            onChange={handleChangeProperty}
                            value={property}
                            variant="standard"
                            fullWidth
                            autoFocus
                        />
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
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddThing;


