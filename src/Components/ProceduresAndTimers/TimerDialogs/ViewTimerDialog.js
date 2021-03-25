import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../Util';

const useStyles = makeStyles(() => ({
    warnColor: {
        color: amber[700],
    },
}));

const ViewTimerDialog = ({button, open, onClose, timer}) => {
    const classes = useStyles();
    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            maxWidth="md"
            actionButtons={timer.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" className={classes.warnColor}>
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
                                secondary={timer.next_run}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Closure"
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                name="timer"
                                type="text"
                                variant="standard"
                                value={timer.definition}
                                fullWidth
                                multiline
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
    timer: PropTypes.object,
};

export default ViewTimerDialog;
