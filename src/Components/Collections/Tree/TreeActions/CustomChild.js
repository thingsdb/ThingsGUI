/* eslint-disable react/no-multi-comp */
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ClearIcon from '@material-ui/icons/Clear';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import StandardChild from './StandardChild';


const CustomChild = ({onVal, onBlob, customTypes, dataTypes, type}) => {
    const [blob, setBlob] = React.useState({});
    const [val, setVal] = React.useState({});
    const [optional, setOptional] = React.useState({});
    const [open, setOpen] = React.useState({});
    React.useEffect(() => {
        // if (open[k]) {

        // }
        let s = Object.entries(val).map(([k, v])=> open[k]?`${k}: ${v}`:'');
        if (s.length) {
            onVal(`${type.slice(-1)=='?'?type.slice(0, -1):type}{${s}}`);
            onBlob(blob);
            console.log(s);
        }
    },
    [JSON.stringify(val)],
    );

    React.useEffect(() => {
        setVal([]);
    },[type]);

    const handleChild = (n) => (c) => {
        setVal({...val, [n]: c});
    };

    const handleRemoveOptional = (k) => () => { //TODO test potentially multiple un use blob can be stacked in the blob object. Because blob object is not removed in this case.
        setOptional({...optional, [k]: true});
        setBlob(prevBlob => {
            let copyState = JSON.parse(JSON.stringify(prevBlob));
            let key = Object.keys(copyState).find(i=>val[k].includes(i));
            delete copyState[key];
            return copyState;
        });
        setVal(prevVal => {
            let copyState = JSON.parse(JSON.stringify(prevVal));
            delete copyState[k];
            return copyState;
        });
    };

    const handleAddOptional = (k) => () => {
        setOptional({...optional, [k]: false});
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

    const renderThing = (name, type, arrayType=null) =>  {
        let t = type.trim();
        return(
            // t.slice(-1)=='?' ? (
            //     optional[name] ? null : (
            //         renderThing(name,t.slice(0,-1), arrayType)
            //     )
            // ) :
            t[0]=='[' || t[0]=='{' ? (
                <StandardChild name={name} type={t.slice(1, -1)} onVal={handleChild(name)} onBlob={handleBlob} customTypes={customTypes} dataTypes={dataTypes} arrayType={t[0]=='[' ? 'list' : t[0]=='{' ? 'set' : ''} />
            ) : (
                <StandardChild name={name} type={t} onVal={handleChild(name)} onBlob={handleBlob} customTypes={customTypes} dataTypes={dataTypes} arrayType={arrayType} />
            )
        );
    };

    return(
        <React.Fragment>
            {( Object.entries(customTypes[type.slice(-1)=='?'?type.slice(0, -1):type]).map (([k,v]) => (
                <React.Fragment key={k}>
                    <Grid container>
                        <Grid item xs={8} container alignItems="center">
                            <Typography color="primary" variant="body1">
                                {k}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} container alignItems="center" justify="flex-end">
                            {/* {v.slice(-1)=='?'? (
                                <IconButton onClick={optional[k]?handleAddOptional(k):handleRemoveOptional(k)}>
                                    {optional[k] ?  <AddIcon color="primary" /> : <ClearIcon color="primary" /> }
                                </IconButton>
                            ) : null} */}
                            <IconButton onClick={open[k]?handleClose(k):handleOpen(k)}>
                                {open[k] ?  <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> }
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider absolute />
                    <Collapse in={open[k]} timeout="auto">
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
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
};

export default CustomChild;