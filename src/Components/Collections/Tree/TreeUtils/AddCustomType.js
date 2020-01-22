/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import InputField from '../TreeActions/InputField';
import {ListHeader} from '../../../Util';

const useStyles = makeStyles(theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '20px',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    fullWidth: {
        width: '100%',
    },
    bottom: {
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    margin: {
        padding: 0,
        margin: 0,
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
    nested: {
        paddingLeft: theme.spacing(6),
        // borderBottom: `2px solid ${theme.palette.primary.main}`,
        // borderRadius: '30px',
        paddingBottom: theme.spacing(1),
        // marginBottom: theme.spacing(1),
    },
    textfield: {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    input: {
        paddingTop: 0,
        paddingBottom: 0,
        color: theme.palette.primary.main,
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

const AddCustomType = ({customTypes, dataTypes, name, onBlob, onVal, type}) => {
    const classes = useStyles();
    const [blob, setBlob] = React.useState({});
    const [dataType, setDataType] = React.useState({});
    const [myItems, setMyItems] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});

    React.useEffect(() => {
        onVal(`${type}{${myItems}}`);
        onBlob(blob);
    },
    [JSON.stringify(myItems)],
    );

    React.useEffect(() => {
        setBlob({});
        setDataType({});
        setMyItems([]);
        setOpen(false);
        setVal([]);
    },[type]);

    const handleVal = (n) => (c) => {
        setVal({...val, [n]: c});
    };

    const handleChangeType = (n) => ({target}) => {
        const {value} = target;
        setDataType({...dataType, [n]: value});
        if (value == 'nil') {
            setVal({...val, [n]: 'nil'});
        }
    };

    const handleBlob = (b) => {
        setBlob({...blob, ...b});
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        setMyItems(s);
        setBlob(prevBlob => {
            let copy = JSON.parse(JSON.stringify(prevBlob));
            let keys={};
            Object.keys(copy).map((k)=> {
                Object.values(val).map(v=> {
                    if (v.includes(k)){
                        keys[k]=true;
                    } else {
                        keys[k]=false;
                    }
                });
            });
            Object.entries(keys).map(([k, v]) => !v&&delete copy[k]);

            return copy;
        });
        setVal({});
    };

    const typing = ([name, type]) =>  {
        let t = type.trim();
        let opt=false;
        let arr=false;
        let tps = [];
        let chldTps = null;
        if (t.slice(-1)=='?') {
            opt = true;
            t = t.slice(0, -1);
        }

        if (t[0]=='[') {
            arr=true;
            tps = opt?['list','nil']:['list'];
            t = t.slice(1, -1)?t.slice(1, -1):'any';
        } else if (t[0]=='{') {
            arr=true;
            tps = opt?['set','nil']:['set'];
            t = t.slice(1, -1)?t.slice(1, -1):'thing';
        } else {
            if (opt) {
                tps= t=='any' ? dataTypes
                    : typeConv[t] ? [...typeConv[t], 'nil']
                        : [t, 'nil'];

            } else {
                tps= t=='any' ? dataTypes
                    : typeConv[t] ? typeConv[t]
                        : [t];
            }
        }

        if (arr) {
            if (t.slice(-1)=='?') {
                t = t.slice(0, -1);
                chldTps= t=='any' ? dataTypes
                    : typeConv[t] ? [...typeConv[t], 'nil']
                        : [t, 'nil'];
            } else {
                chldTps= t=='any' ? dataTypes
                    : typeConv[t] ? typeConv[t]
                        : [t];
            }
        }

        return(
            [name, tps, chldTps]
        );
    };

    const typeProperties = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    const typesFields = typeProperties?typeProperties.fields.map(c=>typing(c)):[];


    return(
        <React.Fragment>
            {typesFields&&(
                <Grid container>
                    <ListHeader collapse onAdd={handleAdd} onOpen={handleOpen} onClose={handleClose} open={open} items={myItems} name={type} groupSign="{" />
                    <Collapse className={classes.fullWidth} in={open} timeout="auto">
                        {( typesFields.map((c, i) => (
                            <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" key={i}>
                                <Grid item xs={1}>
                                    <FiberManualRecord color="primary" fontSize="small" />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        type="text"
                                        name="property"
                                        label="Property"
                                        value={c[0]}
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
                                        onChange={handleChangeType(c[0])}
                                        value={dataType[c[0]]||c[1][0]}
                                        variant="standard"
                                        select
                                        SelectProps={{native: true}}
                                        fullWidth
                                        disabled={c[1].length<2}
                                    >
                                        {c[1].map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={single.includes(dataType[c[0]]||c[1][0])?7:12}>
                                    <InputField
                                        customTypes={customTypes}
                                        dataType={dataType[c[0]]||c[1][0]}
                                        dataTypes={dataTypes}
                                        childTypes={c[2]}
                                        input={val[c[0]]||''}
                                        onBlob={handleBlob}
                                        onVal={handleVal(c[0])}
                                        variant="standard"
                                        label="Value"
                                    />
                                </Grid>
                            </Grid>
                        )))}
                    </Collapse>
                </Grid>
            )}
        </React.Fragment>
    );
};

AddCustomType.defaultProps = {
    customTypes: null,
    name: '',
};
AddCustomType.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
};

export default AddCustomType;