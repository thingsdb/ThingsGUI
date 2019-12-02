/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';

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



    const renderThing = ([k, v]) =>  {
        let t = v.trim();
        switch (true) {
        case t[0]=='[' && Boolean(customTypes[t.slice(1, -1)]): // array
        case t[0]=='{' && Boolean(customTypes[t.slice(1, -1)]): // set
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
        case t.includes('?'): // optional
            return(
                <React.Fragment key={k}>
                    <CustomChild
                        cb={handleCustom}
                        customTypes={customTypes}
                        name={k}
                        type={t.slice(-1)}
                        activeStep={activeStep}
                        stepId={stepId+1}
                    />
                </React.Fragment>);
        default:
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
                        <InputField name={name} dataType={type} cb={handleVal} input={input.val} margin="dense" />
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