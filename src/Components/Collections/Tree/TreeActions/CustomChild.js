/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import StandardChild from './StandardChild';
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

    const handleChild = (c) => {
        setInput(prevInput => {
            let update;
            update = [...prevInput.val];
            const index = update.findIndex((v) => v.name == c.name);
            index==-1?update.push(c):update.splice(index, 1, c);
            return {...prevInput, val: update};
        });
    };

    const handleChildArray = (id, t) => (c) => {
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

    const renderThing = (name, type) =>  {
        let t = type.trim();
        return(
            t.slice(-1)=='?' ? (
                <React.Fragment>
                    {optional[name]? null : (
                        renderThing(name,t.slice(0,-1))
                    )}
                </React.Fragment>
            ) : t[0]=='[' || t[0]=='{' ? (
                customTypes[t.slice(1, -1).slice(-1)=='?'?type.slice(1, -1).slice(0, -1):type.slice(1, -1)]? (
                    <div className={classes.container}>
                        <ArrayLayout
                            child={(i) => (
                                <CustomChild
                                    cb={handleChildArray(i, t)}
                                    customTypes={customTypes}
                                    name={name}
                                    type={t.slice(1, -1)}
                                    activeStep={activeStep}
                                    stepId={stepId+1}
                                />
                            )}
                            onRemove={handleRemove(t)}
                        />
                    </div>
                ) : (
                    <Collapse in={stepId==activeStep} timeout="auto">
                        <ListItem className={classes.listItem}>
                            <StandardChild name={name} type={t} cb={handleChild} />
                        </ListItem>
                    </Collapse>
                )
            ) : customTypes[t] ? (
                <CustomChild
                    cb={handleChild}
                    customTypes={customTypes}
                    name={name}
                    type={t}
                    activeStep={activeStep}
                    stepId={stepId+1}
                />
            ) : (
                <Collapse in={stepId==activeStep} timeout="auto">
                    <ListItem className={classes.listItem}>
                        <StandardChild name={name} type={t} cb={handleChild} />
                    </ListItem>
                </Collapse>
            )
        );
    };

    return(
        <React.Fragment>
            {( Object.entries(customTypes[type.slice(-1)=='?'?type.slice(0, -1):type]).map (([k,v]) => (
                <React.Fragment key={k}>
                    <Collapse in={stepId>=activeStep} timeout="auto">
                        <ListItem className={classes.listItem}>
                            <ListItemText
                                primary={k}
                                secondary={v}
                                color="primary"
                                primaryTypographyProps={{color:'primary'}}
                                className={classes.listItem}
                            />
                            {v.slice(-1)=='?' ? (
                                <ListItemSecondaryAction className={classes.listItem}>
                                    <IconButton onClick={optional[k]?handleAddOptional(k):handleRemoveOptional(k)}>
                                        {optional[k] ?  <AddIcon color="primary" /> : <ClearIcon color="primary" /> }
                                    </IconButton>
                                </ListItemSecondaryAction>
                            ) : null}
                        </ListItem>
                    </Collapse>
                    {renderThing(k, v)}
                </React.Fragment>
            )))}
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