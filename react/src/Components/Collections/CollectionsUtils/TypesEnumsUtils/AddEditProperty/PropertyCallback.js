import makeStyles from '@mui/styles/makeStyles';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import {Closure} from '../../../../Util';


const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%',
    },
}));

const PropertyCallback = ({onChange}) => {
    const classes = useStyles();
    const [switchIni, setSwitch] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
        if (!checked) {
            onChange({propertyVal:''});
        }
    };

    const handleClosure = (c) => {
        onChange({callback:c});
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
                <Closure onChange={handleClosure} />
            </Collapse>
        </React.Fragment>
    );
};

PropertyCallback.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default PropertyCallback;


