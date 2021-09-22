import { amber } from '@mui/material/colors';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';


const WarnSwitch = withStyles({
    switchBase: {
        color: amber[700],
        '&$checked': {
            color: amber[700],
        },
        '&$checked + $track': {
            backgroundColor: amber[700],
        },
    },
    checked: {},
    track: {},
})(Switch);

const Wpo = ({onChange, input, disabled}) => {
    const [switchIni, setSwitch] = React.useState(input);

    React.useEffect(()=>{
        setSwitch(input);
    },[input]);

    const handleSetWpo = ({target}) => {
        const {checked} = target;
        if(!disabled) {
            setSwitch(checked);
            onChange({wpo:checked});
        }
    };

    return (
        <Typography component="div" variant="caption">
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>
                    {'Disabled'}
                </Grid>
                <Grid item>
                    <WarnSwitch
                        checked={switchIni}
                        onChange={handleSetWpo}
                    />
                </Grid>
                <Grid item>
                    {'Enabled'}
                </Grid>
            </Grid>
        </Typography>
    );
};

Wpo.defaultProps = {
    onChange: ()=>null,
    input: false,
    disabled: false,
};

Wpo.propTypes = {
    onChange: PropTypes.func,
    input: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default Wpo;


