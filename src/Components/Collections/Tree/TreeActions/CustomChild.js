/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import CustomHeader from './CustomHeader';
import CustomStepper from './CustomStepper';
import InputField from './InputField';

const useStyles = makeStyles(theme => ({
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
        paddingLeft: theme.spacing(4),
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

const singles = ['bool', 'bytes', 'float', 'int', 'nil', 'str', 'utf8', 'raw', 'uint', 'pint', 'nint', 'number'];

const CustomChild = ({onVal, onBlob, customTypes, dataTypes, type, name}) => {
    const classes = useStyles();
    const [blob, setBlob] = React.useState({});
    const [dataType, setDataType] = React.useState({});
    const [myItems, setMyItems] = React.useState([]);
    const [open, setOpen] = React.useState({});
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
        setOpen({});
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

    const handleOpen = (k) => () => {
        setOpen({...open, [k]: true});
    };
    const handleClose = (k) => () => {
        setOpen({...open, [k]: false});
    };
    const handleAdd = () => {
        let s = Object.entries(val).map(([k, v])=> `${k}: ${v}`);
        setMyItems(s);

        setBlob(prevBlob => {
            let copy = JSON.parse(JSON.stringify(prevBlob));
            let b = Object.keys(copy).map((k)=> Object.values(val).includes(k)?null:k);
            b.map(key=>delete copy[key]);
            return copy;
        });
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
            t = t.slice(1, -1);
        } else if (t[0]=='{') {
            arr=true;
            tps = opt?['set','nil']:['set'];
            t.slice(1, -1);
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

    const renderInput = ([name, types, childTypes]) => {
        return(
            <React.Fragment key={name}>
                <InputField
                    customTypes={customTypes}
                    dataType={dataType[name]||types[0]}
                    dataTypes={dataTypes}
                    input={val[name]||''}
                    onBlob={handleBlob}
                    onVal={handleVal(name)}
                    childtype={childTypes}
                    variant="standard"
                    label={name}
                />
            </React.Fragment>
        );
    };

    const renderType = (name, types) => {
        return(
            <React.Fragment>
                {types.length>1 ? (
                    <TextField
                        margin="dense"
                        color="primary"
                        id="dataType"
                        type="text"
                        name="dataType"
                        onChange={handleChangeType(name)}
                        value={dataType[name]||types[0]}
                        variant="standard"
                        select
                        SelectProps={{native: true}}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            color: 'primary'
                        }}
                    >
                        {types.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                ):(
                    <Typography variant="body1" component='span'>
                        {` ${types[0]}`}
                    </Typography>
                )}
            </React.Fragment>
        );
    };

    const typeProperties = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    const typesFields = typeProperties?typeProperties.fields.map(c=>typing(c)):[];

    return(
        <React.Fragment>
            {typesFields&&(
                <List component="div" disablePadding dense>
                    {( typesFields.map((c, i) => (
                        <React.Fragment key={i}>
                            <ListItem className={classes.listItem} >
                                <ListItemText
                                    primary={c[0]}
                                    secondary={renderType(c[0], c[1])}
                                    primaryTypographyProps={{
                                        display: 'block',
                                        noWrap: true,
                                    }}
                                    secondaryTypographyProps={{
                                        component:'div',
                                        color: 'primary'
                                    }}
                                    className={classes.listItem}
                                />
                                {!singles.includes(dataType[c[0]]||c[1][0]) && (
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={open[c[0]]? handleClose(c[0]): handleOpen(c[0])}>
                                            {open[c[0]] ?  <ExpandMore /> : <ChevronRightIcon /> }
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                            <Collapse in={singles.includes(dataType[c[0]]||c[1][0])||open[c[0]]} timeout="auto">
                                <div className={classes.nested}>
                                    {renderInput(c)}
                                </div>
                            </Collapse>
                        </React.Fragment>
                    )))}
                </List>
            )}
        </React.Fragment>
    );
};

CustomChild.defaultProps = {
    customTypes: null,
    name: '',
};
CustomChild.propTypes = {
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
};

export default CustomChild;