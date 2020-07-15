/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import {Closure} from '../../../../Util';


const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%',
    },
}));

const PropertyCallback = ({cb}) => {
    const classes = useStyles();
    const [switchIni, setSwitch] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
        if (!checked) {
            cb({propertyVal:''})
        }
    };

    const handleClosure = (c) => {
        cb({callback:c});
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchIni}
                            color="primary"
                            id="switchIni"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Add a closure that will be called on each existing instance and can be used to set a new value"
                />
            </Grid>
            <Collapse className={classes.fullWidth} in={switchIni} timeout="auto" unmountOnExit>
                <Typography variant="caption">
                    {'Callback'}
                </Typography>
                <Closure cb={handleClosure} />
            </Collapse>
        </React.Fragment>
    );
};

PropertyCallback.propTypes = {
    cb: PropTypes.func.isRequired,
};

export default PropertyCallback;


