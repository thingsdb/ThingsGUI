import makeStyles from '@mui/styles/makeStyles';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';


const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%',
    },
}));

const Switching = ({one, two, onChange}) => {
    const classes = useStyles();
    const [switchOI, setSwitch] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
        onChange(checked);
    };

    return (
        <Grid>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>
                    {'Field'}
                </Grid>
                <Grid item>
                    <Switch
                        checked={switchOI}
                        color="primary"
                        onChange={handleSwitch}
                    />
                </Grid>
                <Grid item>
                    {'Method'}
                </Grid>
            </Grid>
            <Collapse in={!switchOI} timeout="auto">
                <Grid className={classes.fullWidth} item xs={12}>
                    {one}
                </Grid>
            </Collapse>
            <Collapse className={classes.fullWidth} in={switchOI} timeout="auto">
                <Grid item xs={12}>
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

