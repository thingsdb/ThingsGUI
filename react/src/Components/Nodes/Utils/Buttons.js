import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutline';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';

import { StartStopPolling } from '../../Util';

const Buttons = ({extraButtons, link, onRefresh}) => (
    <Grid item container xs={12}>
        <Grid container item xs={6} spacing={1}>
            {extraButtons.map((b, i) => (
                <Grid key={`button_${i}`} item>
                    {b}
                </Grid>
            ))}
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end" spacing={1}>
            <Grid item>
                <Tooltip disableFocusListener disableTouchListener title="Go to ThingsDocs">
                    <Button color="primary" target="_blank" href={link}>
                        <HelpIcon />
                    </Button>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip disableFocusListener disableTouchListener title="Refresh counters">
                    <Button variant="text" color="primary" onClick={onRefresh} >
                        <RefreshIcon color="primary" />
                    </Button>
                </Tooltip>
            </Grid>
            <Grid item>
                <StartStopPolling onPoll={onRefresh} title="counters" variant="text" />
            </Grid>
        </Grid>
    </Grid>
);

Buttons.propTypes = {
    extraButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
    link: PropTypes.string.isRequired,
    onRefresh: PropTypes.func.isRequired,
};

export default Buttons;