import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AddTaskDialogTAG } from '../../../Constants/Tags';
import { Closure, EditProvider, ErrorMsg, SimpleModal, SwitchOpen, TimePicker } from '../../Utils';
import { CollectionActions, TaskActions } from '../../../Stores';
import { SetArguments } from '../Utils';
import { NEW_TASK_QUERY, NEW_TASK_FORMAT_QUERY, TASK_EMPTY_QUERY } from '../../../TiQueries/Queries';
import { NEW_TASK_ARGS } from '../../../TiQueries/Arguments';
import { THINGS_DOC_TASK } from '../../../Constants/Links';


const tag = AddTaskDialogTAG;

const initState = {
    args: [],
    blob: {},
    closure: '',
    error: '',
    jsonArgs: '',
    queryString: TASK_EMPTY_QUERY,
    start: null,
};

const query = NEW_TASK_QUERY;

const AddTaskDialog = ({open, onClose, scope}) => {
    const [state, setState] = React.useState(initState);
    const {args, blob, closure, error, jsonArgs, queryString, start} = state;

    const [startType, setStartType] = React.useState('datetime');
    const showDatetime = startType === 'datetime';


    React.useEffect(() => { // clean state
        if(open) {
            setState(initState);
            setStartType('datetime');
        }
    }, [open]);

    const handleChangeStart = (s) => {
        setState({...state, start: s, queryString: NEW_TASK_FORMAT_QUERY(s, closure, args), jsonArgs: NEW_TASK_ARGS(s, closure, args)});
    };

    const handleChangeClosure = (c) => {
        setState({...state, closure: c, queryString: NEW_TASK_FORMAT_QUERY(start, c, args), jsonArgs: NEW_TASK_ARGS(start, c, args)});
    };

    const handleChangeArgs = React.useCallback((args, blob) => {
        setState(state => ({...state, args: args, blob: blob, queryString: NEW_TASK_FORMAT_QUERY(start, closure, JSON.stringify(args)), jsonArgs: NEW_TASK_ARGS(start, closure, args)}));
    }, [closure, start]);

    const handleSwitchArgs = (open) => {
        if(!open) {
            handleChangeArgs([]);
        }
    };

    const handleChangeStartType = ({target}) => {
        const {value} = target;
        setStartType(value);
    };

    const handleChangeTimestamp = ({target}) => {
        const {value} = target;
        handleChangeStart(value);
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            query,
            tag,
            () => {
                TaskActions.getLightTasks(scope, tag);
                onClose();
            },
            null,
            blob,
            jsonArgs
        );
    };

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
            disableOk={Boolean(error)}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB task:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {'Add new task'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <ListItemText
                                primary="For more information, see:"
                                secondary={
                                    <Link target="_blank" href={THINGS_DOC_TASK}>
                                        {'ThingsDocs'}
                                    </Link>
                                }
                            />
                        </ListItem>
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
                            <ListItemText
                                primary="Add start"
                            />
                        </ListItem>
                        <ListItem>
                            <FormControl margin="none" size="small" fullWidth>
                                <RadioGroup aria-label="position" name="position" value={startType} onChange={handleChangeStartType} row>
                                    <FormControlLabel
                                        value="datetime"
                                        control={<Radio color="primary" />}
                                        label="Add datetime"
                                        labelPlacement="end"
                                    />
                                    <FormControlLabel
                                        value="timestamp"
                                        control={<Radio color="primary" />}
                                        label="Add timestamp"
                                        labelPlacement="end"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </ListItem>
                        <ListItem>
                            {showDatetime ? (
                                <TimePicker onChange={handleChangeStart} />
                            ) : (
                                <TextField
                                    fullWidth
                                    id="timestamp"
                                    label="Timestamp"
                                    margin="dense"
                                    onChange={handleChangeTimestamp}
                                    spellCheck={false}
                                    value={start}
                                    variant="standard"
                                />
                            )}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Add closure"
                            />
                        </ListItem>
                        <ListItem>
                            <Closure onChange={handleChangeClosure} />
                        </ListItem>
                        <ListItem>
                            <SwitchOpen label="Add argument values [optional]" onChange={handleSwitchArgs}>
                                <EditProvider>
                                    <SetArguments closure={closure} onChange={handleChangeArgs} />
                                </EditProvider>
                            </SwitchOpen>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

AddTaskDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default AddTaskDialog;
