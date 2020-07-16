import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';


const TwoLabelSwitch = ({input, labelOne, labelTwo, onCallback}) => (
    <Grid>
        <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>
                {labelOne}
            </Grid>
            <Grid item>
                <Switch
                    checked={input}
                    onChange={onCallback}
                />
            </Grid>
            <Grid item>
                {labelTwo}
            </Grid>
        </Grid>
    </Grid>
);

TwoLabelSwitch.propTypes = {
    input: PropTypes.bool.isRequired,
    labelOne: PropTypes.string.isRequired,
    labelTwo: PropTypes.string.isRequired,
    onCallback: PropTypes.func.isRequired,
};

export default TwoLabelSwitch;

