import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { nextRunFn, SimpleModal } from '../../Utils';
import { ViewTimerDialogTAG } from '../../../Constants/Tags';
import { TimerActions } from '../../../Stores';


const tag = ViewTimerDialogTAG;

const ViewTimerDialog = ({button, open, onClose, scope, timer}) => {
    const [args, setArgs] = React.useState([]);

    const handleRefresh = React.useCallback(() => {
        TimerActions.getTimerArgs(
            scope,
            timer.id,
            tag,
            (a) => {
                setArgs(a);
            });
    }, [scope, timer.id]);

    React.useEffect(() => {
        if(open) {
            handleRefresh();
        }
    }, [open, handleRefresh]);

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            maxWidth="md"
            actionButtons={timer.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" sx={{color: amber[700]}}>
                        {'Note: this timer generates an event.'}
                    </Typography>
                </ListItem>
            ):null}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'View ThingDB timer:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {timer.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <ListItemText
                                primary="ID"
                                secondary={timer.id}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Documentation"
                                secondary={timer.doc || '-'}
                            />
                        </ListItem>
                        {timer.user &&
                            <ListItem>
                                <ListItemText
                                    primary="Creator"
                                    secondary={timer.user}
                                />
                            </ListItem>
                        }
                        <ListItem>
                            <ListItemText
                                primary="Next run"
                                secondary={nextRunFn(timer.next_run)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Repeat"
                                secondary={timer.repeat + ' seconds'}
                            />
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="refresh" onClick={handleRefresh}>
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary="Timer arguments"
                                secondary={`[${args}]`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Definition"
                                secondary={timer.definition ?
                                    <TextField
                                        fullWidth
                                        multiline
                                        name="timer"
                                        type="text"
                                        value={timer.definition}
                                        variant="standard"
                                        InputProps={{
                                            readOnly: true,
                                            disableUnderline: true,
                                        }}
                                        inputProps={{
                                            style: {
                                                fontFamily: 'monospace',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    : '-'}
                                secondaryTypographyProps={{
                                    component: 'div'
                                }}
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

ViewTimerDialog.defaultProps = {
    button: null,
    timer: {},
};

ViewTimerDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    timer: PropTypes.object,
};

export default ViewTimerDialog;
