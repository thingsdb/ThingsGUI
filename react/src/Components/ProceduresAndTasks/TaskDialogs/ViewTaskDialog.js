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
import { TaskActions } from '../../../Stores';
import { ViewTaskDialogTAG } from '../../../Constants/Tags';


const tag = ViewTaskDialogTAG;

const ViewTaskDialog = ({button, open, onClose, scope, task}) => {
    const [args, setArgs] = React.useState([]);

    const handleRefresh = React.useCallback(() => {
        TaskActions.getArgs(
            scope,
            task.id,
            tag,
            (a) => {
                setArgs(a);
            });
    }, [scope, task.id]);

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
            actionButtons={task.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" sx={{color: amber[700]}}>
                        {'Note: this task generates an event.'}
                    </Typography>
                </ListItem>
            ):null}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'View ThingDB task:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {task.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <ListItemText
                                primary="ID"
                                secondary={task.id}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="At"
                                secondary={nextRunFn(task.at)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Owner"
                                secondary={task.owner}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Error"
                                secondary={task.err || '-'}
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
                                primary="Task arguments"
                                secondary={`[${args}]`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Closure"
                                secondary={task.closure ?
                                    <TextField
                                        fullWidth
                                        multiline
                                        name="task"
                                        type="text"
                                        value={task.closure}
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

ViewTaskDialog.defaultProps = {
    button: null,
    task: {},
};

ViewTaskDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    task: PropTypes.object,
};

export default ViewTaskDialog;
