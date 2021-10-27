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
import { ErrorMsg, SimpleModal, SwitchOpen, VariablesArray } from '../../Utils';
import { NIL } from '../../../Constants/ThingTypes';
import { ThingsdbActions, ThingsdbStore } from '../../../Stores';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);


const replaceNull = (items) => (items||[]).map(item => item === null ? NIL : item);

const tag = EditTaskDialogTAG;

const EditTaskDialog = ({button, open, onClose, task, scope, users}) => {
    const [queryString, setQueryString] = React.useState({set_args: '', set_owner: ''});
    const [args, setArgs] = React.useState([]);
    const [owner, setOwner] = React.useState('');

    const handleChangeArgs = React.useCallback((a) => {
        setArgs(a);
        setQueryString(query => ({...query, set_args: `task(${task.id}).set_args([${replaceNull(a)}]);`}));
    }, [task.id]);

    const handleChangeOwner = React.useCallback((o) => {
        setOwner(o);
        setQueryString(query => ({...query, set_owner: `task(${task.id}).set_owner('${o}');`}));
    }, [task.id]);

    const handleRefreshArgs = React.useCallback(() => {
        TaskActions.getArgs(
            scope,
            task.id,
            tag,
            handleChangeArgs);
    }, [scope, task.id, handleChangeArgs]);

    const handleRefreshOwner= React.useCallback(() => {
        TaskActions.getOwner(
            scope,
            task.id,
            tag,
            handleChangeOwner);
    }, [scope, task.id, handleChangeOwner]);


    React.useEffect(() => {
        if(open) {
            handleRefreshArgs();
            handleRefreshOwner();
            ThingsdbActions.getUsers();
        }
    }, [open, handleRefreshArgs, handleRefreshOwner]);

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            `${queryString.set_args} ${queryString.set_owner}`,
            tag,
            () => {
                TaskActions.getTasks(scope, tag);
                onClose();
            }
        );
    };

    const handleChangeSelect = ({target}) => {
        const {value} = target;
        handleChangeOwner(value);
    };

    const handleSwitchArgs = (open) => {
        if(!open) {
            handleChangeArgs('');
        }
    };

    const handleSwitchOwner = (open) => {
        if(!open) {
            handleChangeOwner('');
        }
    };

    let qstr = `${queryString.set_args} ${queryString.set_owner}`;
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
                            <SwitchOpen label="Change arguments" onChange={handleSwitchArgs}>
                                <VariablesArray input={replaceNull(args)} onChange={handleChangeArgs} />
                            </SwitchOpen>
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="refresh" onClick={handleRefreshOwner}>
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            }
                        >
                            <SwitchOpen label="Change owner" onChange={handleSwitchOwner}>
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
