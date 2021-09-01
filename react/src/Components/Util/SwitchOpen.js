import {makeStyles} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%'
    },
}));

const SwitchOpen = ({children, label, onChange}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setOpen(checked);
        onChange(checked);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={open}
                            color="primary"
                            id="switch"
                            onChange={handleSwitch}
                        />
                    )}
                    label={label}
                />
            </Grid>
            <Collapse className={classes.fullWidth} in={open} timeout="auto" unmountOnExit>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Collapse>
        </Grid>
    );
};

SwitchOpen.defaultProps = {
    onChange: ()=>null,
};

SwitchOpen.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

export default SwitchOpen;