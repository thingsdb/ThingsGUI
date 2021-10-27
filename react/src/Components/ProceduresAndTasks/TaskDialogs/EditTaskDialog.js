import { amber } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
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

import { CollectionActions, TaskActions } from '../../../Stores';
import { EditTaskDialogTAG } from '../../../Constants/Tags';
import { ErrorMsg, SimpleModal, VariablesArray } from '../../Utils';
import { NIL } from '../../../Constants/ThingTypes';


const replaceNull = (items) => items.map(item => item === null ? NIL : item);

const tag = EditTaskDialogTAG;

const EditTaskDialog = ({button, open, onClose, task, scope}) => {
    const [queryString, setQueryString] = React.useState('set_task_args()');
    const [args, setArgs] = React.useState([]);

    const handleChangeArgs = React.useCallback((a) => {
        setArgs(a);
        setQueryString(`set_task_args(${task.id}, [${replaceNull(a)}])`);
    }, [task.id]);

    const handleRefresh = React.useCallback(() => {
        TaskActions.getTaskArgs(
            scope,
            task.id,
            tag,
            handleChangeArgs);
    }, [scope, task.id, handleChangeArgs]);


    React.useEffect(() => {
        if(open) {
            handleRefresh();
        }
    }, [open, handleRefresh]);

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            queryString,
            tag,
            () => {
                TaskActions.getTasks(scope, tag);
                onClose();
            }
        );
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
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
                            {'Customizing ThingDB task:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {task.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                {task.definition ? (
                    <Grid item xs={12}>
                        <List disablePadding dense>
                            <Collapse in={Boolean(queryString)} timeout="auto">
                                <ListItem>
                                    <TextField
                                        fullWidth
                                        label="Query"
                                        maxRows="10"
                                        multiline
                                        name="queryString"
                                        type="text"
                                        value={queryString}
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
                                </ListItem>
                            </Collapse>
                            <ListItem>
                                <Typography variant="body1" >
                                    {'Edit task:'}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <TextField
                                    fullWidth
                                    multiline
                                    name="task"
                                    type="text"
                                    value={task.definition}
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
                            </ListItem>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="refresh" onClick={handleRefresh}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary="Set arguments"
                                />
                            </ListItem>
                            <ListItem>
                                <VariablesArray input={replaceNull(args)} onChange={handleChangeArgs} />
                            </ListItem>
                        </List>
                    </Grid>
                ) : (
                    <Grid container spacing={1} item xs={12}>
                        <Grid item>
                            <Typography>
                                <Box sx={{fontSize: 16, fontStyle: 'italic', m: 1, color: 'text.secondary'}}>
                                    {'Task cannot be edited.'}
                                </Box>
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </SimpleModal>
    );
};

EditTaskDialog.defaultProps = {
    button: null,
    task: {},
};

EditTaskDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditTaskDialog;
