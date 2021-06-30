import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/HelpOutline';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';

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
        <Grid container item xs={6} justify="flex-end" spacing={1}>
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