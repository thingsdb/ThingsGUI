/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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

    const renderInput = (name, types, childTypes) => {
        return(
            <Grid key={name} container item xs={12} alignItems="center">
                <Grid xs={12} item>
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
            </Grid>
        );
    };

    const renderType = (name, types, childTypes) => {
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

    const renderCustom = (name, type, fn) =>  {
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
            fn(name, tps, chldTps)
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

    const typeProperties = React.useCallback(customTypes.find(c=> c.name==(type[0]=='<'?type.slice(1, -1):type)), [type]);
    const maxSteps = typeProperties.fields.length;

    console.log(customTypes, type, typeProperties);

    return(
        <Grid container item xs={12}>
            <Grid className={classes.bottom} container item xs={12}>
                <Grid item xs={10} container justify="flex-start" alignItems="center">
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
                {maxSteps<2 ? (
                    <Grid container item xs={1} alignItems="center" justify="flex-end">
                        <Fab color="primary" onClick={handleAdd} size="small">
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Grid>
                ) : null}
                <Grid item xs={1} container alignItems="center" justify="flex-end">
                    <Fab color="primary" onClick={open[type]?handleClose(type):handleOpen(type)} size="small">
                        {open[type] ?  <ExpandMore /> : <ChevronRightIcon /> }
                    </Fab>
                </Grid>
            </Grid>
            <Collapse className={classes.fullWidth} in={open[type]} timeout="auto">
                {maxSteps>1 ? (
                    <React.Fragment>
                        <Divider color="primary" />
                        <Grid container item xs={12} alignItems="center" >
                            <Grid item xs={2} container justify="flex-start">
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    <KeyboardArrowLeft color="primary" />
                                    {'Back'}
                                </Button>
                            </Grid>
                            <Grid item xs={8}>
                                <Stepper className={classes.margin} activeStep={activeStep}>
                                    {typeProperties.fields.map((c, i) => (
                                        <Step key={c[0]}>
                                            <StepLabel>
                                                {c[0]}
                                                <Collapse key={c[0]} className={classes.fullWidth} in={i==activeStep} timeout="auto">
                                                    {renderCustom(c[0], c[1], renderType)}
                                                </Collapse>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                            <Grid item xs={2} container justify="flex-end">
                                {activeStep === maxSteps - 1 ? (
                                    <Button size="small" onClick={handleAdd}>
                                        {'Finish'}
                                        <AddIcon color="primary" />
                                    </Button>

                                ):(
                                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                        {'Next'}
                                        <KeyboardArrowRight color="primary" />
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                        <Divider color="primary" />
                    </React.Fragment>
                ) : null}
                {( typeProperties.fields.map((c, i) => (
                    <Collapse key={c[0]} className={classes.fullWidth} in={i==activeStep} timeout="auto">
                        {renderCustom(c[0], c[1], renderInput)}
                    </Collapse>
                )))}
            </Collapse>
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