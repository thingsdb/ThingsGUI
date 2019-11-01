/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';

import InputField from './InputField';
import ArrayLayout from './ArrayLayout';

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const CustomChild = ({errors, cb, customTypes, name, type, activeStep, stepId}) => {
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

    const setType = (t) => {
        let type = [];
        switch (true) {
        case t.includes('str'):
            type=['string', 'str'];
            break;
        case t.includes('int'):
            type=['number', 'int'];
            break;
        case t.includes('float'):
            type=['number', 'float'];
            break;
        case t.includes('bool'):
            type=['boolean', 'bool'];
            break;
        case t.includes('thing'):
            type=['thing', 'thing'];
            break;
        case t.includes('['): //array
            type=['array', t];
            break;
        case t.includes('{'): // set
            type=['set', t];
            break;
        default:
            type =[t, t];
        }
        return type;
    };

    const handleVal = (val) => {
        setInput({...input, val: val});
    };

    const handleCustom = (c) => {
        setInput(prevInput => {
            let updatedInput;
            if (prevInput.val) {
                let b=false;
                let copy = [...prevInput.val];
                prevInput.val.map((v, i) => {
                    if (v.name == c.name) {
                        copy.splice(i, 1, c);
                        b=true;
                    }
                });
                updatedInput = b?copy:[...prevInput.val, c];
            } else {
                updatedInput = [c];
            }
            return {...prevInput, val: updatedInput};
        });
    };

    const handleCustomArray = (id, t) => (c) => {
        setInput(prevInput => {
            let updatedInput;
            let index;
            prevInput.val.map((v, i) => {
                if (v.name == c.name && v.type == t) {
                    const copy = [...v.val];
                    copy.splice(id, 1, c);
                    updatedInput = {name: v.name, type: v.type, val: copy};
                    index = i;
                }
            });
            let copy2 = [...prevInput.val];
            index ? copy2.splice(index, 1, updatedInput) : copy2.push({name: c.name, type: t, val: [c]});

            return {...prevInput, val: copy2};
        });
    };

    const renderThing = ([k, v]) => setType(v)[0] == 'array' ? (
        <React.Fragment key={k}>
            <ArrayLayout
                child={(i) => (
                    <Card className={classes.card} raised>
                        <CustomChild
                            errors={errors}
                            cb={handleCustomArray(i, v)}
                            customTypes={customTypes}
                            name={k}
                            type={setType(v)[1].substring(1,setType(v)[1].length-1)}
                            activeStep={activeStep}
                            stepId={stepId+1}
                        />
                    </Card>
                )}
            />
        </React.Fragment>
    ) : (
        <React.Fragment key={k}>
            <CustomChild
                errors={errors}
                cb={handleCustom}
                customTypes={customTypes}
                name={k}
                type={setType(v)[1]}
                activeStep={activeStep}
                stepId={stepId+1}
            />
        </React.Fragment>
    );


    const renderChildren = () => {
        return (
            <Collapse in={stepId!=activeStep} timeout="auto">
                {Object.entries(customTypes[type]).map(renderThing)}
            </Collapse>
        );
    };

    return(
        <React.Fragment>
            {customTypes[type] ? (
                <React.Fragment>
                    <Collapse in={stepId==activeStep} timeout="auto">
                        <ListItem className={classes.listItem}>
                            <ListItemText
                                primary={name}
                                secondary={setType(type)[0]}
                                color="primary"
                                primaryTypographyProps={{color:'primary'}}
                            />
                        </ListItem>
                    </Collapse>
                    {renderChildren()}
                </React.Fragment>
            ) : (
                <Collapse in={stepId==activeStep} timeout="auto">
                    <ListItem className={classes.listItem}>
                        <InputField name={name} dataType={setType(type)[0]} error="" cb={handleVal} />
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
    errors: PropTypes.object.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeStep: PropTypes.number.isRequired,
    stepId: PropTypes.number.isRequired,
};

export default CustomChild;