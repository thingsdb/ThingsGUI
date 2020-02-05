import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import InputField from '../TreeActions/InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../TreeActions/Context';


const useStyles = makeStyles(theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        borderRight: `3px solid ${theme.palette.primary.main}`,
        borderRadius: '20px',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(6),
    },
}));

const single = [
    'bool',
    'bytes',
    'float',
    'int',
    'nil',
    'str',
];

const AddArray = ({childTypes, customTypes, dataTypes, isSet, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState(childTypes[0]||dataTypes[0]||'str');

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        setDataType(childTypes[0]||dataTypes[0]);
    },
    [childTypes.length, dataTypes.length],
    );

    React.useEffect(() => {
        EditActions.updateVal(parentDispatch,isSet?`set([${array}])`:`[${array}]`, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },
    [array.length],
    );

    React.useEffect(() => {
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
    },[isSet]);

    const handleChange = ({target}) => {
        const {value} = target;
        setDataType(value);
        EditActions.updateVal(dispatch, '');
    };

    const typeControls = (type, input) => {
        return type === 'nil' ? 'nil'
            : type === 'str' ? (input[0]=='\''? `${input}`:`'${input}'`)
                : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, val);
        EditActions.addToArr(dispatch, contentTypeChecked);
    };

    const handleClick = (index, item) => () => {
        EditActions.deleteBlob(dispatch, item);
        EditActions.deleteFromArr(dispatch, index);
    };

    return (
        <Grid container>
            <ListHeader onAdd={handleAdd} onDelete={handleClick} items={array} groupSign="[">
                <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="flex-end" >
                    {childTypes.length == 1 ? null : (
                        <Grid item xs={2}>
                            <TextField
                                id="dataType"
                                type="text"
                                name="dataType"
                                onChange={handleChange}
                                value={dataType}
                                variant="standard"
                                select
                                SelectProps={{native: true}}
                            >
                                {(childTypes.length?childTypes:dataTypes).map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    )}
                    <Grid item xs={single.includes(dataType)?10:12}>

                        <InputField
                            customTypes={customTypes}
                            dataType={dataType}
                            dataTypes={dataTypes}
                            variant="standard"
                            label="Value"
                        />
                    </Grid>
                </Grid>
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
    isSet: PropTypes.bool,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddArray;


