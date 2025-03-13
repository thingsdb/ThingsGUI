import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import {Closure} from '../../../../Utils';


const PropertyCallback = ({onChange}: Props) => {
    const [switchCallback, setSwitchCallback] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchCallback(checked);
        if (!checked) {
            onChange({callback: ''});
        }
    };

    const handleClosure = (c) => {
        onChange({callback: c});
    };

    return (
        <React.Fragment>
            <Grid size={12}>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchCallback}
                            color="primary"
                            id="switchCallback"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Add a closure that will be called on each existing instance and can be used to set a new value"
                />
            </Grid>
            <Collapse in={switchCallback} timeout="auto" unmountOnExit sx={{width: '100%'}}>
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

interface Props {
    onChange: any;
}