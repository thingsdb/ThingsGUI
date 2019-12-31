/* eslint-disable react/no-multi-comp */
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import InputField from './InputField';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
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
    'any': ['str'],
};

const CustomChild = ({onVal, onBlob, customTypes, dataTypes, type}) => {
    const classes = useStyles();
    const [blob, setBlob] = React.useState({});
    const [preBlob, setPreBlob] = React.useState({});
    const [val, setVal] = React.useState({});
    const [open, setOpen] = React.useState({});
    const [dataType, setDataType] = React.useState({});
    const [myItems, setMyItems] = React.useState([]);

    React.useEffect(() => {
        onVal(`${type.slice(-1)=='?'?type.slice(0, -1):type}{${myItems}}`);
        onBlob(blob);
    },
    [JSON.stringify(myItems)],
    );

    React.useEffect(() => {
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
        setPreBlob({...preBlob, ...b});
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
        setBlob({...blob, ...preBlob});
        setPreBlob({});
    };

    const renderInput = (name, types, childTypes, index) => {
        return(
            <Grid container item xs={12} >
                <Grid container item xs={12} >
                    <Grid item xs={8} container alignItems="center">
                        <Typography color="primary" variant="body1">
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="center" justify="flex-end">
                        <IconButton onClick={open[name]?handleClose(name):handleOpen(name)}>
                            {open[name] ?  <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> }
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse in={open[name]} timeout="auto">
                    <Grid item xs={12}>
                        <TextField
                            id="dataType"
                            type="text"
                            name="dataType"
                            label="Data type"
                            onChange={handleChangeType(name)}
                            value={dataType[name]||types[0]}
                            variant="outlined"
                            fullWidth
                            select
                            SelectProps={{native: true}}
                        >
                            {types.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            customTypes={customTypes}
                            dataType={dataType[name]||types[0]}
                            dataTypes={dataTypes}
                            input={val[name]||''}
                            onBlob={handleBlob}
                            onVal={handleVal(name)}
                            childtype={childTypes}
                            variant="outlined"

                        />
                    </Grid>
                </Collapse>
            </Grid>
        );
    };

    const renderCustom = (name, type, index) =>  {
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
                    : typeConv[type] ? [...typeConv[t], 'nil']
                        : [t, 'nil'];
            } else {
                tps= t=='any' ? dataTypes
                    : typeConv[type] ? typeConv[t]
                        : [t];
            }
        }

        if (arr) {
            if (t.slice(-1)=='?') {
                t = t.slice(0, -1);
                chldTps= t=='any' ? dataTypes
                    : typeConv[type] ? [...typeConv[t], 'nil']
                        : [t, 'nil'];
            } else {
                chldTps= t=='any' ? dataTypes
                    : typeConv[type] ? typeConv[t]
                        : [t];
            }
        }

        return(
            renderInput(name, tps, chldTps, index)
        );
    };

    const makeAddedList = () => {
        const elements =  myItems.map((listitem, index) => (
            <Chip
                key={index}
                id={listitem}
                className={classes.chip}
                label={listitem}
                color="primary"
            />
        ));
        return elements;
    };

    return(
        <Grid container >
            <Grid container item xs={12}>
                <Grid item xs={11} container justify="flex-start" alignItems="center">
                    <Typography variant="h5" color="primary">
                        {`${type}`}
                    </Typography>
                    <Typography variant="h3" color="primary">
                        {'{'}
                    </Typography>
                    {makeAddedList()}
                    <Typography variant="h3" color="primary">
                        {'}'}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Fab color="primary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
            <Grid container item xs={12} >
                {( customTypes.find(c=> c.name==type.slice(-1)=='?'?type.slice(0, -1):type).fields.map((c, i) => (
                    <React.Fragment key={c[0]}>
                        {renderCustom(c[0], c[1], i)}
                    </React.Fragment>
                )))}
            </Grid>
        </Grid>
    );
};

CustomChild.defaultProps = {
    customTypes: null,
};
CustomChild.propTypes = {
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
};

export default CustomChild;