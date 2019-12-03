/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import InputField from './InputField';
import {ArrayLayout} from '../../../Util';

const useStyles = makeStyles(theme => ({
    container: {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        borderRight: `3px solid ${theme.palette.primary.main}`,
        borderRadius: '20px',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const CustomChild = ({cb, customTypes, name, type, activeStep, stepId}) => {
    const classes = useStyles();
    const [input, setInput] = React.useState({
        name: name,
        type: type,
        val: [],
    });
    const [optional, setOptional] = React.useState({});

    React.useEffect(() => {
        cb(input);
    },
    [JSON.stringify(input || {})],
    );

    React.useEffect(() => {
        setInput(prevInput => {
            const updatedInput = Object.assign({}, prevInput, {name: name});
            return updatedInput;
        });
    },
    [name],
    );

    React.useEffect(() => {
        setInput(prevInput => {
            const updatedInput = Object.assign({}, prevInput, {type: type, val: []});
            return updatedInput;
        });
    },
    [type],
    );

    const handleVal = (val) => {
        setInput({...input, val: val});
    };

    const handleCustom = (c) => {
        setInput(prevInput => {
            let update;
            update = [...prevInput.val];
            const index = update.findIndex((v) => v.name == c.name);
            index==-1?update.push(c):update.splice(index, 1, c);
            return {...prevInput, val: update};
        });
    };

    const handleCustomArray = (id, t) => (c) => {
        setInput(prevInput => {
            let update = [...prevInput.val];
            const index = prevInput.val.findIndex((v) => v && v.name == c.name && v.type == t);
            if (index == -1) {
                update.push({name: c.name, type: t, val: [c]});
            } else {
                update[index].val.splice(id, 1, c);
                update.splice(index, 1, {name: update[index].name, type: update[index].type, val: update[index].val});
            }
            return {...prevInput, val: update};
        });
    };

    const handleRemove = (t) => (i) => {
        setInput(prevInput => {
            let update = [...prevInput.val];
            const index = prevInput.val.findIndex((v) => v && v.type == t);
            update[index].val.splice(i, 1);
            update.splice(index, 1, {name: update[index].name, type: update[index].type, val: update[index].val});
            return {...prevInput, val: update};
        });
    };

    const handleRemoveOptional = (k) => () => {
        setOptional({...optional, [k]: true});
        setInput(prevInput => {
            let update = [...prevInput.val];
            const index = update.findIndex((v) => v.name == k);
            update.splice(index, 1);
            return {...prevInput, val: update};
        });
    };

    const handleAddOptional = (k) => () => {
        setOptional({...optional, [k]: false});
    };

    const renderThing = ([k, v]) =>  {
        let t = v.trim();
        switch (true) {
        case t[0]=='[' && (t.slice(1, -1).slice(-1)=='?' ? Boolean(customTypes[t.slice(1, -2)]):Boolean(customTypes[t.slice(1, -1)]) ): // array
        case t[0]=='{' && (t.slice(1, -1).slice(-1)=='?' ? Boolean(customTypes[t.slice(1, -2)]):Boolean(customTypes[t.slice(1, -1)]) ):// set
            console.log(k, t);
            return(
                <React.Fragment key={k}>
                    <ArrayLayout
                        child={(i) => (
                            <div className={classes.container}>
                                <CustomChild
                                    cb={handleCustomArray(i, v)}
                                    customTypes={customTypes}
                                    name={k}
                                    type={t.slice(1, -1)}
                                    activeStep={activeStep}
                                    stepId={stepId+1}
                                />
                            </div>
                        )}
                        onRemove={handleRemove(v)}
                    />
                </React.Fragment>
            );
        case t.slice(-1)=='?': // optional
            console.log(k, t);
            return(
                <Grid container key={k}>
                    <Grid item xs={10}>
                        {optional[k]? null : (
                            renderThing([k,t.slice(0,-1)])
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        <Fab color="primary" onClick={optional[k]?handleAddOptional(k):handleRemoveOptional(k)} size="small">
                            {optional[k] ?  <AddIcon /> : <ClearIcon /> }
                        </Fab>
                    </Grid>
                </Grid>
            );
        default:
            console.log(k, t);
            return(
                <React.Fragment key={k}>
                    <CustomChild
                        cb={handleCustom}
                        customTypes={customTypes}
                        name={k}
                        type={t}
                        activeStep={activeStep}
                        stepId={stepId+1}
                    />
                </React.Fragment>);
        }
    };

    const renderChildren = () => {
        return (
            <Collapse in={stepId<activeStep} timeout="auto">
                {Object.entries(customTypes[type]).map(renderThing)}
            </Collapse>
        );
    };
    console.log(type);
    return(
        <React.Fragment>
            {customTypes[type] ? (
                <React.Fragment>
                    <ListItem className={classes.listItem}>
                        <ListItemText
                            primary={name}
                            secondary={type}
                            color="primary"
                            primaryTypographyProps={{color:'primary'}}
                        />
                    </ListItem>
                    {renderChildren()}
                </React.Fragment>
            ) : (
                <Collapse in={stepId==activeStep} timeout="auto">
                    <ListItem className={classes.listItem}>
                        {type.slice(-1)=='?' ? (
                            <Grid container >
                                <Grid item xs={10}>
                                    {optional[name]? null : (
                                        <InputField name={name} dataType={type.slice(0,-1)} cb={handleVal} input={input.val} margin="dense" />
                                    )}
                                </Grid>
                                <Grid item xs={2}>
                                    <Fab color="primary" onClick={optional[name]?handleAddOptional(name):handleRemoveOptional(name)} size="small">
                                        {optional[name] ?  <AddIcon /> : <ClearIcon /> }
                                    </Fab>
                                </Grid>
                            </Grid>
                        ) : (
                            <InputField name={name} dataType={type} cb={handleVal} input={input.val} margin="dense" />
                        )}
                    </ListItem>
                </Collapse>
            )}
        </React.Fragment>
    );
};

CustomChild.defaultProps = {
    customTypes: null,
};
CustomChild.propTypes = {
    cb: PropTypes.func.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeStep: PropTypes.number.isRequired,
    stepId: PropTypes.number.isRequired,
};

export default CustomChild;