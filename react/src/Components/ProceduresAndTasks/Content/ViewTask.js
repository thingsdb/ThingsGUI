import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import TextField from '@mui/material/TextField';

import { nextRunFn, replacer, useThingsError } from '../../Utils';
import { TaskActions } from '../../../Stores';
import { ViewTaskDialogTAG } from '../../../Constants/Tags';


const tag = ViewTaskDialogTAG;

const ViewTask = ({scope, task}) => {
    const customizedErr = useThingsError(task.err || '')[1];
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
        handleRefresh();
    }, [handleRefresh]);

    return (
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
                    secondary={!task.err ? '-' : customizedErr}
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
                    secondary={JSON.stringify(args, replacer, 4)}
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
    );
};

ViewTask.defaultProps = {
    task: {},
};

ViewTask.propTypes = {
    scope: PropTypes.string.isRequired,
    task: PropTypes.object,
};

export default ViewTask;
