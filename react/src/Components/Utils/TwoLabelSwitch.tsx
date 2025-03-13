import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';


const TwoLabelSwitch = ({input, labelOne, labelTwo, onChange}: Props) => (
    <Grid>
        <Grid component="label" container alignItems="center" spacing={1}>
            <Grid>
                {labelOne}
            </Grid>
            <Grid>
                <Switch
                    checked={input}
                    onChange={onChange}
                />
            </Grid>
            <Grid>
                {labelTwo}
            </Grid>
        </Grid>
    </Grid>
);

TwoLabelSwitch.propTypes = {
    input: PropTypes.bool.isRequired,
    labelOne: PropTypes.string.isRequired,
    labelTwo: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TwoLabelSwitch;

interface Props {
    input: boolean;
    labelOne: string;
    labelTwo: string;
    onChange: React.ChangeEventHandler<any>;
}