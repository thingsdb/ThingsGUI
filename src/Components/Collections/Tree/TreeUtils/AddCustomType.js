/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import InputField from '../TreeActions/InputField';
import {ListHeader} from '../../../Util';
import {EditActions, useEdit} from '../TreeActions/Context';

const useStyles = makeStyles(theme => ({
    fullWidth: {
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(6),
        paddingBottom: theme.spacing(1),
    },
}));

const typeConv = {
    'bool': ['bool'],
    'bytes': ['bytes'],
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

const single = ['bool', 'bytes', 'float', 'int', 'nil', 'str', 'utf8', 'raw', 'uint', 'pint', 'nint', 'number'];

const typing = ([fprop, type], dataTypes) =>  {
    let t = type.trim();
    let opt=false;
    let arr=false;
    let ftype = [];
    let fchldtype = null;


    if (t.slice(-1)=='?') {
        opt = true;
        t = t.slice(0, -1);
    }

    if (t[0]=='[') {
        arr=true;
        ftype = opt?['nil', 'list']:['list'];
        t = t.slice(1, -1)?t.slice(1, -1):'any';
    } else if (t[0]=='{') {
        arr=true;
        ftype = opt?['nil', 'set']:['set'];
        t = t.slice(1, -1)?t.slice(1, -1):'thing';
    } else {
        if (opt) {
            ftype= t=='any' ? dataTypes
                : typeConv[t] ? ['nil', ...typeConv[t]]
                    : ['nil', t];

        } else {
            ftype= t=='any' ? dataTypes
                : typeConv[t] ? typeConv[t]
                    : [t];
        }
    }

    // if array, set childtypes
    if (arr) {
        if (t.slice(-1)=='?') {
            t = t.slice(0, -1);
            fchldtype= t=='any' ? dataTypes
                : typeConv[t] ? ['nil', ...typeConv[t]]
                    : ['nil', t];
        } else {
            fchldtype= t=='any' ? dataTypes
                : typeConv[t] ? typeConv[t]
                    : [t];
        }
    }

    return(
        [fprop, ftype, fchldtype]
    );
};

const AddCustomType = ({customTypes, dataTypes, type, identifier, parentDispatch}) => {
    const classes = useStyles();
    const [dataType, setDataType] = React.useState({});
    const [open, setOpen] = React.useState(false);

    const [editState, dispatch] = useEdit();
    const {array, val, blob} = editState;

    React.useEffect(() => {
        setDataType({});
        setOpen(false);
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
    },[type]);

    const handleChangeType = (n) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [n]: value});
        if (value == 'nil') {
            EditActions.updateVal(dispatch, {...val, [n]: 'nil'});
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        EditActions.update(dispatch, {
            array:  s,
        });
        EditActions.updateVal(parentDispatch,`${type}{${s}}`, identifier);
        EditActions.updateBlob(parentDispatch, s, blob);
    };

    const typeObj = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    const typeFields = typeObj?typeObj.fields.map(c=>typing(c, dataTypes)):[];


    return(
        <React.Fragment>
            {typeFields&&(
                <Grid container>
                    <ListHeader collapse onAdd={handleAdd} onOpen={handleOpen} onClose={handleClose} open={open} items={array} name={type} groupSign="{">
                        <Collapse className={classes.fullWidth} in={open} timeout="auto">
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
                                    <Grid item xs={single.includes(dataType[fprop]||ftype[0])?7:12}>
                                        <InputField
                                            customTypes={customTypes}
                                            dataType={dataType[fprop]||ftype[0]}
                                            dataTypes={dataTypes}
                                            childTypes={fchldtype}
                                            variant="standard"
                                            label="Value"
                                            identifier={fprop}
                                        />
                                    </Grid>
                                </Grid>
                            )))}
                        </Collapse>
                    </ListHeader>
                </Grid>
            )}
        </React.Fragment>
    );
};

AddCustomType.defaultProps = {
    customTypes: null,
    identifier: null,
};
AddCustomType.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    parentDispatch: PropTypes.func.isRequired,
};

export default AddCustomType;