/* eslint-disable react-hooks/exhaustive-deps */
import { amber } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';


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

const Wpo = ({cb, input, disabled}) => {
    const [switchIni, setSwitch] = React.useState(input);

    React.useEffect(()=>{
        setSwitch(input);
    },[input]);

    const handleSetWpo = ({target}) => {
        const {checked} = target;
        if(!disabled) {
            setSwitch(checked);
            cb({wpo:checked});
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
    cb: ()=>null,
    input: false,
    disabled: false,
};

Wpo.propTypes = {
    cb: PropTypes.func,
    input: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default Wpo;


