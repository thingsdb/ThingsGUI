import { amber } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CollectionActions, TimerActions } from '../../../Stores';
import { ErrorMsg, SimpleModal, VariablesArray } from '../../Util';
import { EditTimerDialogTAG } from '../../../Constants/Tags';
import { NIL } from '../../../Constants/ThingTypes';


const replaceNull = (items) => items.map(item => item === null ? NIL : item);

const tag = EditTimerDialogTAG;

const EditTimerDialog = ({button, open, onClose, timer, scope}) => {
    const [queryString, setQueryString] = React.useState('set_timer_args()');
    const [args, setArgs] = React.useState([]);

    const handleChangeArgs = React.useCallback((a) => {
        setArgs(a);
        setQueryString(`set_timer_args(${timer.id}, [${replaceNull(a)}])`);
    }, [timer.id]);

    const handleRefresh = React.useCallback(() => {
        TimerActions.getTimerArgs(
            scope,
            timer.id,
            tag,
            handleChangeArgs);
    }, [scope, timer.id, handleChangeArgs]);


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
                TimerActions.getTimers(scope, tag);
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
                            {'Customizing ThingDB timer:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {timer.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                {timer.definition ? (
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
                                    {'Edit timer:'}
                                </Typography>
                            </ListItem>
                            <ListItem>
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
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Set arguments"
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="refresh" onClick={handleRefresh}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </ListItemSecondaryAction>
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
                                    {'Timer cannot be edited.'}
                                </Box>
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </SimpleModal>
    );
};

EditTimerDialog.defaultProps = {
    button: null,
    timer: {},
};

EditTimerDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    timer: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditTimerDialog;
