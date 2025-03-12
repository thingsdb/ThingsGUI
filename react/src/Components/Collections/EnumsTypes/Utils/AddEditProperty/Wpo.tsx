import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';


const Wpo = ({
    onChange = () => null,
    input = false,
    disabled = false,
}: Props) => {
    const [switchWpo, setSwitchWpo] = React.useState(input);

    React.useEffect(()=>{
        setSwitchWpo(input);
    },[input]);

    const handleSetWpo = ({target}) => {
        const {checked} = target;
        if(!disabled) {
            setSwitchWpo(checked);
            onChange({wpo:checked});
        }
    };

    return (
        <Typography component="div" variant="caption">
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid>
                    {'Disabled'}
                </Grid>
                <Grid>
                    <Switch
                        checked={switchWpo}
                        onChange={handleSetWpo}
                        sx={{
                            '& .MuiSwitch-switchBase': {
                                '&.Mui-checked': {
                                    color: amber[700],
                                    '& + .MuiSwitch-track': {
                                        color: amber[700],
                                        backgroundColor: amber[700],
                                    },
                                },

                            }
                        }}
                    />
                </Grid>
                <Grid>
                    {'Enabled'}
                </Grid>
            </Grid>
        </Typography>
    );
};

Wpo.propTypes = {
    disabled: PropTypes.bool,
    input: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Wpo;


interface Props {
    disabled?: boolean;
    input?: boolean;
    onChange?: (d: object) => void;
}
