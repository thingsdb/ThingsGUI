import { withVlow } from 'vlow';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CollectionActions, TaskActions } from '../../../Stores';
import { EditTaskDialogTAG } from '../../../Constants/Tags';
import { Closure, EditProvider, ErrorMsg, SimpleModal, SwitchOpen } from '../../Utils';
import { NIL } from '../../../Constants/ThingTypes';
import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import SetArguments from './SetArguments';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const replaceNull = (items) => (items||[]).map(item => item === null ? NIL : item);
const tag = EditTaskDialogTAG;

const EditTaskDialog = ({button, open, onClose, task, scope, users}) => {
    const [queryString, setQueryString] = React.useState({set_args: '', set_closure: '', set_owner: ''});
    const [args, setArgs] = React.useState([]);
    const [blob, setBlob] = React.useState({});
    const [owner, setOwner] = React.useState('');

    let qstr = `${queryString.set_args}${queryString.set_closure}${queryString.set_owner}`;

    const handleRefreshArgs = React.useCallback(() => {
        TaskActions.getArgs(
            scope,
            task.id,
            tag,
            setArgs);
    }, [scope, task.id]);

    const handleRefreshOwner= React.useCallback(() => {
        TaskActions.getOwner(
            scope,
            task.id,
            tag,
            setOwner);
    }, [scope, task.id]);


    React.useEffect(() => {
        if(open) {
            handleRefreshArgs();
            handleRefreshOwner();
            ThingsdbActions.getUsers();
        }
    }, [open, handleRefreshArgs, handleRefreshOwner]);

    const handleChangeArgs = React.useCallback((args, blob) => {
        setArgs(args);
        setBlob(blob);
        setQueryString(query => ({...query, set_args: `task(${task.id}).set_args([${replaceNull(args)}]);`}));
    },[task.id]);

    const handleChangeClosure = (c) => {
        setQueryString(query => ({...query, set_closure: ` task(${task.id}).set_closure('${c}');`}));
    };

    const handleChangeOwner = (o) => {
        setOwner(o);
        setQueryString(query => ({...query, set_owner: ` task(${task.id}).set_owner('${o}');`}));
    };

    const handleChangeSelect = ({target}) => {
        const {value} = target;
        handleChangeOwner(value);
    };

    const handleSwitchArgs = (open) => {
        if(!open) {
            setArgs('');
            setBlob({});
            setQueryString(query => ({...query, set_args: ''}));
        }
    };


    const handleSwitchClosure = (open) => {
        if(!open) {
            setQueryString(query => ({...query, set_closure: ''}));
        }
    };

    const handleSwitchOwner = (open) => {
        if(!open) {
            setOwner('');
            setQueryString(query => ({...query, set_owner: ''}));
        }
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            `${queryString.set_args} ${queryString.set_owner}`,
            tag,
            () => {
                TaskActions.getTasks(scope, tag);
                onClose();
            },
            null,
            blob,
        );
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
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
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <Collapse in={Boolean(qstr)} timeout="auto">
                            <ListItem>
                                <TextField
                                    fullWidth
                                    label="Query"
                                    maxRows="10"
                                    multiline
                                    name="queryString"
                                    type="text"
                                    value={qstr}
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
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="refresh" onClick={handleRefreshArgs}>
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            }
                        >
                            <SwitchOpen label={`Change arguments: ${args}`} onChange={handleSwitchArgs}>
                                <EditProvider>
                                    <SetArguments closure={task.closure || ''} onChange={handleChangeArgs} />
                                </EditProvider>
                            </SwitchOpen>
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="refresh" onClick={handleRefreshArgs}>
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            }
                        >
                            <SwitchOpen label="Change closure" onChange={handleSwitchClosure}>
                                <EditProvider>
                                    <Closure input={task.closure} onChange={handleChangeClosure} />
                                </EditProvider>
                            </SwitchOpen>
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="refresh" onClick={handleRefreshOwner}>
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            }
                        >
                            <SwitchOpen label={`Change owner: ${task.owner}`} onChange={handleSwitchOwner}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    label="Owner"
                                    margin="dense"
                                    name="owner"
                                    onChange={handleChangeSelect}
                                    select
                                    SelectProps={{native: true}}
                                    value={owner}
                                    variant="standard"
                                >
                                    {users.map((u) => (
                                        <option key={u.name} value={u.name}>
                                            {u.name}
                                        </option>
                                    ))}
                                </TextField>
                            </SwitchOpen>
                        </ListItem>
                    </List>
                </Grid>
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

    /* thingsdb properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(EditTaskDialog);
