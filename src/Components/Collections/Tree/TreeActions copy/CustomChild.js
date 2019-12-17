/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Collapse from '@material-ui/core/Collapse';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import StandardChild from './StandardChild';

const useStyles = makeStyles(() => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
}));

const CustomChild = ({onVal, onBlob, customTypes, name, type, activeStep, stepId}) => {
    const classes = useStyles();
    const [blob, setBlob] = React.useState({});
    const [val, setVal] = React.useState([]);
    const [optional, setOptional] = React.useState({});
    React.useEffect(() => {
        onVal({name: name, type: type, val: val});
        onBlob(blob);
    },
    [JSON.stringify(val)],
    );

    React.useEffect(() => {
        setVal([]);
    },[type]);

    const handleChild = (c) => {
        setVal(prevVal => {
            let update;
            update = [...prevVal];
            const index = update.findIndex((v) => v.name == c.name);
            index==-1?update.push(c):update.splice(index, 1, c);
            return update;
        });
    };

    const handleRemoveOptional = (k) => () => { //TODO test potentially multiple un use blob can be stacked in the blob object. Because blob object is not removed in this case.
        setOptional({...optional, [k]: true});
        setVal(prevVal => {
            let update = [...prevVal];
            const index = update.findIndex((v) => v.name == k);
            if (index != -1) {
                update.splice(index, 1);
            }
            return update;
        });
    };

    const handleAddOptional = (k) => () => {
        setOptional({...optional, [k]: false});
    };

    const handleBlob = (b) => {
        setBlob({...blob, ...b});
    };

    const renderThing = (name, type) =>  {
        let t = type.trim();
        return(
            t.slice(-1)=='?' ? (
                optional[name] ? null : (
                    renderThing(name,t.slice(0,-1))
                )
            ) : t[0]=='[' || t[0]=='{' ? (
                <ListItem className={classes.listItem}>
                    <StandardChild name={name} type={t.slice(1, -1)} arrayType={t[0]=='[' ? 'list' : t[0]=='{' ? 'set' : ''} onVal={handleChild} onBlob={handleBlob} />
                </ListItem>
            ) : (
                <ListItem className={classes.listItem}>
                    <StandardChild name={name} type={t} onVal={handleChild} onBlob={handleBlob} />
                </ListItem>
            )
        );
    };

    return(
        <React.Fragment>
            {( Object.entries(customTypes[type.slice(-1)=='?'?type.slice(0, -1):type]).map (([k,v]) => (
                <React.Fragment key={k}>
                    <ListItem className={classes.listItem}>
                        <ListItemText
                            primary={k}
                            color="primary"
                            primaryTypographyProps={{color:'primary'}}
                            className={classes.listItem}
                        />
                        {v.slice(-1)=='?' && stepId==activeStep? (
                            <ListItemSecondaryAction className={classes.listItem}>
                                <IconButton onClick={optional[k]?handleAddOptional(k):handleRemoveOptional(k)}>
                                    {optional[k] ?  <AddIcon color="primary" /> : <ClearIcon color="primary" /> }
                                </IconButton>
                            </ListItemSecondaryAction>
                        ) : null}
                    </ListItem>
                    <Collapse in={open}>
                        {renderThing(k, v)}
                    </Collapse>
                </React.Fragment>
            )))}
        </React.Fragment>

    );
};

CustomChild.defaultProps = {
    customTypes: null,
};
CustomChild.propTypes = {
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeStep: PropTypes.number.isRequired,
    stepId: PropTypes.number.isRequired,
};

export default CustomChild;