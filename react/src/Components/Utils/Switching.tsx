import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';


const Switching = ({one, two, onChange}: Props) => {
    const [switchOI, setSwitchOI] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchOI(checked);
        onChange(checked);
    };

    return (
        <Grid>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid>
                    {'Field'}
                </Grid>
                <Grid>
                    <Switch
                        checked={switchOI}
                        color="primary"
                        onChange={handleSwitch}
                    />
                </Grid>
                <Grid>
                    {'Method'}
                </Grid>
            </Grid>
            <Collapse in={!switchOI} timeout="auto" sx={{width: '100%'}}>
                <Grid size={12}>
                    {one}
                </Grid>
            </Collapse>
            <Collapse in={switchOI} timeout="auto" sx={{width: '100%'}}>
                <Grid size={12}>
                    {two}
                </Grid>
            </Collapse>
        </Grid>
    );
};

Switching.propTypes = {
    onChange: PropTypes.func.isRequired,
    one: PropTypes.object.isRequired,
    two: PropTypes.object.isRequired,
};

export default Switching;

interface Props {
    onChange: (d: boolean) => void;
    one: React.ReactElement;
    two: React.ReactElement;
}