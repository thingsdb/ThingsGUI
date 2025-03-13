import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import HelpIcon from '@mui/icons-material/HelpOutline';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from '@mui/material/Tooltip';

import { StartStopPolling } from '../../Utils';

const Buttons = ({extraButtons, link, onRefresh, title}: Props) => (
    <Grid container size={12}>
        <Grid container size={6} spacing={1}>
            {extraButtons.map((b, i) => (
                <Grid key={`button_${i}`}>
                    {b}
                </Grid>
            ))}
        </Grid>
        <Grid container size={6} justifyContent="flex-end" spacing={1}>
            <Grid>
                <Tooltip disableFocusListener disableTouchListener title="Go to ThingsDocs">
                    <Button color="primary" target="_blank" href={link}>
                        <HelpIcon />
                    </Button>
                </Tooltip>
            </Grid>
            <Grid>
                <Tooltip disableFocusListener disableTouchListener title={`Refresh ${title}`}>
                    <Button variant="text" color="primary" onClick={onRefresh} >
                        <RefreshIcon color="primary" />
                    </Button>
                </Tooltip>
            </Grid>
            <Grid>
                <StartStopPolling onPoll={onRefresh} title={title} variant="text" />
            </Grid>
        </Grid>
    </Grid>
);

Buttons.propTypes = {
    extraButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
    link: PropTypes.string.isRequired,
    onRefresh: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default Buttons;

interface Props {
    extraButtons: any[];
    link: string;
    onRefresh: () => void;
    title: string;
}