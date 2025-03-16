import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';


const SwitchOpen = ({
    children,
    label,
    onChange = () => null
}: Props) => {
    const [open, setOpen] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setOpen(checked);
        onChange(checked);
    };

    return (
        <Grid container>
            <Grid size={12}>
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
                <Grid size={12}>
                    {children}
                </Grid>
            </Collapse>
        </Grid>
    );
};

SwitchOpen.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

export default SwitchOpen;

interface Props {
    children: React.ReactNode;
    label: string;
    onChange: (d: boolean) => void;
}
