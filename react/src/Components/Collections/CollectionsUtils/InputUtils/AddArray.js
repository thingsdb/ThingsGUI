import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';
import {NIL, STR} from '../../../../Constants/ThingTypes';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
    },
}));


const AddArray = ({childTypes, customTypes, dataTypes, enums, isSet, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState(childTypes[0]||dataTypes[0]||STR);

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        let arr = isSet?`set([${array}])`:`[${array}]`;

        EditActions.updateVal(parentDispatch, arr, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },
    [array, blob, identifier, isSet, parentDispatch],
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setDataType(value);
        EditActions.updateVal(dispatch, '');
    };

    const typeControls = (type, input) => {
        return type === NIL ? NIL
            : type === STR ? (input[0]=='\''? `${input}`:`'${input}'`)
                : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, val);
        EditActions.addToArr(dispatch, contentTypeChecked);
    };

    const handleRefresh = () => {
        EditActions.update(dispatch, {
            array:  [],
        });
        EditActions.updateVal(parentDispatch,'[]', identifier);
    };

    const handleClick = (index, item) => () => {
        EditActions.deleteBlob(dispatch, item);
        EditActions.deleteFromArr(dispatch, index);
    };

    return (
        <Grid item xs={12}>
            <ListHeader canCollapse onAdd={handleAdd} onDelete={handleClick} onRefresh={handleRefresh} items={array} groupSign="[">
                <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
                    {childTypes.length == 1 ? null : (
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                id="dataType"
                                label="Data type"
                                margin="dense"
                                name="dataType"
                                onChange={handleChange}
                                select
                                SelectProps={{native: true}}
                                type="text"
                                value={dataType}
                                variant="standard"
                            >
                                {(childTypes.length?childTypes:dataTypes).map(p => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    )}
                    <InputField
                        customTypes={customTypes}
                        dataType={dataType}
                        dataTypes={dataTypes}
                        enums={enums}
                        variant="standard"
                        label="Value"
                    />
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
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSet: PropTypes.bool,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddArray;

