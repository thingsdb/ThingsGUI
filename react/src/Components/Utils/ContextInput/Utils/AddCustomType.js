/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ANY, BOOL, BYTES, CLOSURE, CODE, DATETIME,ERROR, FLOAT, INT, LIST, NIL, NINT, NUMBER, PINT, RAW, REGEX, ROOM, SET, STR, THING, TIMEVAL, UINT, UTF8 } from '../../../../Constants/ThingTypes';
import { CollectionActions } from '../../../../Stores';
import { EditActions, useEdit } from '../Context';
import InputField from '../InputField';
import useDebounce from '../../useDebounce';


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

const optional = (type) => {
    let ftype = [];
    if (type.slice(-1)=='?') {
        type = type.slice(0, -1);
        ftype = [NIL];
    }
    return([type, ftype]);
};

const fntype = (type, ftype, dataTypes) => {
    if(type.slice(-1) == '>'){
        type = type.split('<')[0];
    }
    return(type == ANY ? dataTypes
        : typeConv[type] ? [...ftype, ...typeConv[type]]
            : [...ftype, type]);
};

const array = (type, ftype, arrayType, def, dataTypes) => {
    let fchldtype;

    ftype = [...ftype, arrayType];
    type = type.slice(1, -1) ? type.slice(1, -1) : def;
    [type, fchldtype] = optional(type);
    fchldtype = fntype(type, fchldtype, dataTypes);

    return([ftype, fchldtype]);
};

const typing = ([fprop, type], dataTypes) =>  {
    type = type.trim();
    let ftype = [];
    let fchldtype = null;

    [type, ftype] = optional(type);

    if (type[0]=='[') {
        [ftype, fchldtype] = array(type, ftype, LIST, ANY, dataTypes);
    } else if (type[0]=='{') {
        [ftype, fchldtype] = array(type, ftype, SET, THING, dataTypes);
    } else {
        ftype = fntype(type, ftype, dataTypes);
    }

    return(
        [fprop, ftype, fchldtype]
    );
};


const AddCustomType = ({customTypes, dataTypes, enums, type, identifier, parent, parentDispatch}) => {
    const [typeFields, setTypeFields] = React.useState([]);
    const [dataType, setDataType] = React.useState({});

    const [editState, dispatch] = useEdit();
    const {val, blob} = editState;

    const updateContext = React.useCallback(() => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(parentDispatch,'val', `${type}{${s}}`, identifier, parent);
        EditActions.updateBlob(parentDispatch, s, blob);
        CollectionActions.enableSubmit();
    }, [blob, identifier, parent, parentDispatch, type, val]);

    const [updateContextDebounced] = useDebounce(updateContext, 200);

    React.useEffect(() => {
        CollectionActions.disableSubmit();
        updateContextDebounced();
    }, [updateContextDebounced]);

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
        dispatch(prev => {
            let copy = {...prev.val};
            copy[n] = '';
            return {val: copy};
        });
    };

    return(
        typeFields && (
            <Grid item xs={12}>
                {( typeFields.map(([fprop, ftype, fchldtype], i) => (
                    <Grid container item xs={12} alignItems="center" key={i} sx={{paddingBottom: '8px'}}>
                        <Grid item xs={2} sx={{paddingRight: '8px'}}>
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
                        <Grid item xs={2} sx={{paddingRight: '8px'}}>
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
                            childTypes={fchldtype}
                            customTypes={customTypes}
                            dataType={dataType[fprop]||ftype[0]}
                            dataTypes={dataTypes}
                            enums={enums}
                            fullWidth
                            identifier={fprop}
                            label="Value"
                            variant="standard"
                        />
                    </Grid>
                )))}
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
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parent: PropTypes.string.isRequired,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddCustomType;