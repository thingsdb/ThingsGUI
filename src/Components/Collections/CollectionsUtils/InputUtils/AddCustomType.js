/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import InputField from '../InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(6),
        paddingBottom: theme.spacing(1),
    },
}));

const typeConv = {
    'bool': ['bool'],
    'bytes': ['bytes'],
    'code': ['code'],
    'closure': ['closure'],
    'error': ['error'],
    'float': ['float'],
    'int': ['int'],
    'list': ['list'],
    'nil': ['nil'],
    'regex': ['regex'],
    'set': ['set'],
    'str': ['str'],
    'thing': ['thing'],
    'utf8': ['str'],
    'raw': ['str', 'bytes'],
    'uint': ['int'],
    'pint': ['int'],
    'nint': ['int'],
    'number': ['int', 'float'],
};

const optional = (t) => {
    let ftype = [];
    if (t.slice(-1)=='?') {
        t = t.slice(0, -1);
        ftype = ['nil'];
    }
    return([t, ftype]);
};

const fntype = (t, ftype, dataTypes) => {
    if(t.slice(-1) == '>'){
        t = t.split('<')[0];
    }
    return(t == 'any' ? dataTypes
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
        [ftype, fchldtype] = array(t, ftype, 'list', 'any', dataTypes);
    } else if (t[0]=='{') {
        [ftype, fchldtype] = array(t, ftype, 'set', 'thing', dataTypes);
    } else {
        ftype = fntype(t, ftype, dataTypes);
    }

    return(
        [fprop, ftype, fchldtype]
    );
};

const AddCustomType = ({customTypes, dataTypes, enums, type, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState({});

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        EditActions.updateVal(parentDispatch,`${type}{${array}}`, identifier);
        EditActions.updateBlob(parentDispatch, array, blob);
    },[]);

    const handleChangeType = (n) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [n]: value});
        if (value == 'nil') {
            EditActions.updateVal(dispatch, {...val, [n]: 'nil'});
        }
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
        EditActions.update(dispatch, {
            array:  [],
        });
        EditActions.updateVal(parentDispatch,`${type}{}`, identifier);

    };

    const typeObj = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    const typeFields = typeObj?typeObj.fields.map(c=>typing(c, dataTypes)):[];

    return(
        typeFields&&(
            <Grid item xs={12}>
                <ListHeader canCollapse onAdd={handleAdd} onRefresh={handleRefresh} items={array} name={type} groupSign="{" unmountOnExit>
                    {( typeFields.map(([fprop, ftype, fchldtype], i) => (
                        <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" key={i}>
                            <Grid item xs={2}>
                                <TextField
                                    type="text"
                                    name="property"
                                    label="Property"
                                    value={fprop}
                                    variant="standard"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    type="text"
                                    name="dataType"
                                    label="Data type"
                                    onChange={handleChangeType(fprop)}
                                    value={dataType[fprop]||ftype[0]}
                                    variant="standard"
                                    select
                                    SelectProps={{native: true}}
                                    fullWidth
                                    disabled={ftype.length<2}
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