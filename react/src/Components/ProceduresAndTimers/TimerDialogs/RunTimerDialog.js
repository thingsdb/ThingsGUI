import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { TimerActions } from '../../../Stores';
import { ErrorMsg, SimpleModal, QueryOutput } from '../../Utils';
import { RunTimerDialogTAG } from '../../../Constants/Tags';

const tag = RunTimerDialogTAG;

const RunTimerDialog = ({button, open, onClose, timer, scope}) => {
    const [output, setOutput] = React.useState('');

    React.useEffect(() => { // clean state
        setOutput('');
    },
    [open],
    );

    const handleResult = (data) => {
        setOutput(data);
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
    };

    const handleClickOk = () => {
        TimerActions.runTimer(
            scope,
            timer,
            tag,
            handleResult,
        );
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            actionButtons={
                <React.Fragment>
                    {timer.with_side_effects&&(
                        <ListItem>
                            <Typography variant="caption" sx={{color: amber[700]}}>
                                {'Note: this timer generates an event.'}
                            </Typography>
                        </ListItem>
                    )}
                    <Button color="primary" onClick={handleClickOk}>
                        {'Run'}
                    </Button>
                </React.Fragment>
            }
            maxWidth="md"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Run  ThingDB timer:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {timer.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <React.Fragment>
                            <ListItem>
                                <ListItemText primary="Output:" />
                            </ListItem>
                            <div id="output">
                                <QueryOutput output={output} />
                            </div>
                        </React.Fragment>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

RunTimerDialog.defaultProps = {
    button: null,
    timer: {},
};


RunTimerDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    timer: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default RunTimerDialog;
