import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AddTaskDialogTAG } from '../../../Constants/Tags';
import { Closure, EditProvider, ErrorMsg, SimpleModal, SwitchOpen, TimePicker } from '../../Utils';
import { CollectionActions, TaskActions } from '../../../Stores';
import { THINGS_DOC_TASK } from '../../../Constants/Links';
import { SetArguments } from '../Utils';


const tag = AddTaskDialogTAG;

const initState = {
    args: [],
    blob: {},
    closure: '',
    error: '',
    queryString: 'task()',
    start: null,
};

const AddTaskDialog = ({open, onClose, scope}) => {
    const [state, setState] = React.useState(initState);
    const {args, blob, closure, error, queryString, start} = state;


    React.useEffect(() => { // clean state
        setState(initState);
    }, [open]);

    const handleChangeStart = (s) => {
        setState({...state, start: s, queryString: `task(datetime(${s}), ${closure}${args.length ? `, [${args}]`: ''})`});
    };

    const handleChangeClosure = (c) => {
        setState({...state, closure: c, queryString: `task(datetime(${start}), ${c}${args.length ? `, [${args}]`: ''})`});
    };

    const handleChangeArgs = React.useCallback((args, blob) => {
        setState(state => ({...state, args: args, blob: blob, queryString: `task(datetime(${start}), ${closure}${args.length ? `, [${args}]`: ''})`}));
    }, [closure, start]);

    const handleSwitchArgs = (open) => {
        if(!open) {
            handleChangeArgs([]);
        }
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            queryString,
            tag,
            () => {
                TaskActions.getTasks(scope, tag);
                onClose();
            },
            null,
            blob
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
                            <TimePicker onChange={handleChangeStart} />
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
                            <SwitchOpen label="Add arguments [optional]" onChange={handleSwitchArgs}>
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
