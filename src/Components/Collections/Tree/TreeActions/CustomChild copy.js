/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
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
    }
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
    const [activeStep, setActiveStep] = React.useState(0);
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
        setActiveStep(0);
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

    const handleNext = () => {
        setActiveStep(activeStep+1);
    };

    const handleBack = () => {
        setActiveStep(activeStep-1);
    };

    const renderCustom = (fn) => ([name, type]) =>  {
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
            fn(name, tps, chldTps)
        );
    };

    const renderInput = (name, types, childTypes) => {
        return(
            <Grid key={name} container item xs={12} alignItems="center">
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
            </Grid>
        );
    };

    const renderType = (name, types) => {
        return(
            <Grid key={name} container item xs={12} alignItems="center">
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
        );
    };

    const typeProperties = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    console.log(typeProperties, customTypes, type);
    const maxSteps = typeProperties.fields.length;

    return(
        <Grid container item xs={12}>
            <CustomHeader onAdd={handleAdd} onOpen={handleOpen(type)} onClose={handleClose(type)} open={open[type]||false} items={myItems} type={type} maxSteps={maxSteps} />
            <Collapse className={classes.fullWidth} in={open[type]} timeout="auto">
                <CustomStepper onAdd={handleAdd} onBack={handleBack} onNext={handleNext} items={typeProperties.fields} activeStep={activeStep} maxSteps={maxSteps} renderCustom={renderCustom(renderType)} />
                {( typeProperties.fields.map((c, i) => (
                    <Collapse key={c[0]} className={classes.fullWidth} in={i==activeStep} timeout="auto">
                        {renderCustom(renderInput)(c)}
                    </Collapse>
                )))}
            </Collapse>
        </Grid>
        <ListItem key={k} button onClick={handleConnectToo(k)}>
            <ListItemText primary={k} secondary={v.address} />
            <ListItemSecondaryAction>
                <IconButton onClick={open? handleClose: handleOpen}>
                    {open ?  <ExpandMore /> : <ChevronRightIcon /> }
                </IconButton>
            </ListItemSecondaryAction>
            <Collapse className={classes.fullWidth} in={open} timeout="auto">
                <List>
                    {( typeProperties.fields.map((c, i) => (
                        renderCustom(renderInput)(c)
                    )))}
                </List>
            </Collapse>
        </ListItem>
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