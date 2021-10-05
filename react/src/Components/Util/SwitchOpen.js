import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';


const SwitchOpen = ({children, label, onChange}) => {
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
            <Collapse in={open} timeout="auto" unmountOnExit sx={{width: '100%'}}>
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