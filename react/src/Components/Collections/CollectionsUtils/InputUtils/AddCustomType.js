/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';
import {ANY, BOOL, BYTES, CLOSURE, CODE, DATETIME,ERROR, FLOAT, INT, LIST, NIL, NINT, NUMBER, PINT, RAW,
    REGEX, ROOM, SET, STR, THING, TIMEVAL, UINT, UTF8} from '../../../../Constants/ThingTypes';

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
        paddingBottom: theme.spacing(1),
    },
}));


const typeConv = {
    [BOOL]: [BOOL, CODE, CODE],
    [BYTES]: [BYTES, CODE],
    [CODE]: [CODE],
    [CLOSURE]: [CLOSURE, CODE],
    [DATETIME]: [DATETIME],
    [ERROR]: [ERROR, CODE],
    [FLOAT]: [FLOAT, CODE],
    [INT]: [INT, CODE],
    [LIST]: [LIST, CODE],
    [NIL]: [NIL, CODE],
    [REGEX]: [REGEX, CODE],
    [ROOM]: [ROOM, CODE],
    [SET]: [SET, CODE],
    [STR]: [STR, CODE],
    [THING]: [THING, CODE],
    [TIMEVAL]: [TIMEVAL],
    [UTF8]: [STR, CODE],
    [RAW]: [STR, BYTES, CODE],
    [UINT]: [INT, CODE],
    [PINT]: [INT, CODE],
    [NINT]: [INT, CODE],
    [NUMBER]: [INT, FLOAT, CODE],
};

const optional = (t) => {
    let ftype = [];
    if (t.slice(-1)=='?') {
        t = t.slice(0, -1);
        ftype = [NIL];
    }
    return([t, ftype]);
};

const fntype = (t, ftype, dataTypes) => {
    if(t.slice(-1) == '>'){
        t = t.split('<')[0];
    }
    return(t == ANY ? dataTypes
        : typeConv[t] ? [...ftype, ...typeConv[t]]
            : [...ftype, t]);
};

const array = (t, ftype, arrayType, def, dataTypes) => {
    let fchldtype;

    ftype = [...ftype, arrayType];
    t = t.slice(1, -1) ? t.slice(1, -1) : def;
    [t, fchldtype] = optional(t);
    fchldtype = fntype(t, ftype, dataTypes);

    return([ftype, fchldtype]);
};

const typing = ([fprop, type], dataTypes) =>  {
    let t = type.trim();
    let ftype = [];
    let fchldtype = null;

    [t, ftype] = optional(t);

    if (t[0]=='[') {
        [ftype, fchldtype] = array(t, ftype, LIST, ANY, dataTypes);
    } else if (t[0]=='{') {
        [ftype, fchldtype] = array(t, ftype, SET, THING, dataTypes);
    } else {
        ftype = fntype(t, ftype, dataTypes);
    }

    return(
        [fprop, ftype, fchldtype]
    );
};


const AddCustomType = ({customTypes, dataTypes, enums, type, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [typeFields, setTypeFields] = React.useState([]);
    const [dataType, setDataType] = React.useState({});

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        EditActions.updateVal(parentDispatch,`${type}{${array}}`, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },[]);

    const updateTypeFields = React.useCallback(() => {
        const typeObj = customTypes.find(c => c.name == (type[0] == '<' ? type.slice(1, -1) : type));
        const typef = typeObj ? typeObj.fields.map(c=>typing(c, dataTypes)) : [];
        setTypeFields(typef);
    }, [customTypes, dataTypes, type]);

    React.useEffect(() => {
        updateTypeFields();
    },[updateTypeFields]);

    const handleChangeType = (n) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [n]: value});
    };

    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(dispatch, {
            array:  s,
        });
        EditActions.updateVal(parentDispatch,`${type}{${s}}`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    };
    const handleRefresh = () => {
        EditActions.update(dispatch, {array: []});
        EditActions.updateVal(parentDispatch,`${type}{}`, identifier);
    };

    return(
        typeFields&&(
            <Grid item xs={12}>
                <ListHeader canCollapse onAdd={handleAdd} onRefresh={handleRefresh} items={array} name={type} groupSign="{" unmountOnExit>
                    {( typeFields.map(([fprop, ftype, fchldtype], i) => (
                        <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" key={i}>
                            <Grid item xs={2}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Property"
                                    margin="dense"
                                    name="property"
                                    type="text"
                                    value={fprop}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    disabled={ftype.length<2}
                                    fullWidth
                                    label="Data type"
                                    margin="dense"
                                    name="dataType"
                                    onChange={handleChangeType(fprop)}
                                    select
                                    SelectProps={{native: true}}
                                    type="text"
                                    value={dataType[fprop]||ftype[0]}
                                    variant="standard"
                                >
                                    {ftype.map( p => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <InputField
                                customTypes={customTypes}
                                dataType={dataType[fprop]||ftype[0]}
                                dataTypes={dataTypes}
                                enums={enums}
                                childTypes={fchldtype}
                                variant="standard"
                                label="Value"
                                identifier={fprop}
                            />
                        </Grid>
                    )))}
                </ListHeader>
            </Grid>
        )
    );
};

AddCustomType.defaultProps = {
    customTypes: null,
    enums: null,
    identifier: null,
};
AddCustomType.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    enums: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddCustomType;