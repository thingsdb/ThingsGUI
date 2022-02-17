/*eslint-disable react/no-multi-comp*/
import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { Closure, ErrorMsg, EditProvider, nextRunFn, replacer, parseError, ViewEditFields } from '../../Utils';
import { CollectionActions, TaskActions, TaskStore } from '../../../Stores';
import { EditTaskDialogTAG } from '../../../Constants/Tags';
import { NIL } from '../../../Constants/ThingTypes';
import { SetArguments, SetOwner } from '../Utils';
import { TASK_SET_ARGS_ARGS, TASK_SET_CLOSURE_ARGS, TASK_SET_OWNER_ARGS } from '../../../TiQueries/Arguments';
import { TASK_SET_ARGS_QUERY, TASK_SET_CLOSURE_QUERY, TASK_SET_OWNER_QUERY } from '../../../TiQueries/Queries';

const withStores = withVlow([{
    store: TaskStore,
    keys: ['task']
}]);


const header = [
    {
        ky: 'id',
        label: 'ID',
        canEdit: false,
        viewComponent: (id) => id,
    },
    {
        ky: 'at',
        label: 'At',
        canEdit: false,
        viewComponent: (at) => nextRunFn(at),
    },
    {
        ky: 'err',
        label: 'Error',
        canEdit: false,
        viewComponent: (err) => err ? parseError(err)[1] : '-',
    },
    {
        ky: 'owner',
        label: 'Owner',
        canEdit: true,
        eky: 'owner',
        editComponent: (owner, onChange) => (
            <SetOwner init={owner} onChange={onChange} />
        ),
        viewComponent: (c) => c,
    },
    {
        ky: 'args',
        label: 'Arguments',
        canEdit: true,
        eky: 'closure',
        editComponent: (closure, onChange) => (
            <EditProvider>
                <SetArguments closure={closure || ''} onChange={onChange} />
            </EditProvider>
        ),
        viewComponent: (args) => JSON.stringify(args, replacer, 4),
    },
    {
        ky: 'closure',
        label: 'Closure',
        canEdit: true,
        eky: 'closure',
        editComponent: (closure, onChange) => (
            <EditProvider>
                <Closure input={closure} onChange={onChange} />
            </EditProvider>
        ),
        viewComponent: (closure) => (
            closure ?
                <TextField
                    fullWidth
                    multiline
                    name="task"
                    type="text"
                    value={closure}
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
                : '-'),
    },
];

const replaceNull = (items) => (items||[]).map(item => item === null ? NIL : item);
const tag = EditTaskDialogTAG;

const EditTask = ({taskId, task, scope}) => {
    const [queryString, setQueryString] = React.useState({args: '', closure: '', owner: ''});
    const [jsonArgs, setJsonArgs] = React.useState({args: '', closure: '', owner: ''});
    const [blob, setBlob] = React.useState({});

    React.useEffect(() => {
        TaskActions.getTask(scope, taskId, tag);
    }, [scope, taskId]);

    const handleChangeArgs = React.useCallback((args, blob) => {
        setBlob(blob);
        setQueryString(query => ({...query, args: TASK_SET_ARGS_QUERY}));
        setJsonArgs(jsonArgs => ({...jsonArgs, args: TASK_SET_ARGS_ARGS(taskId, replaceNull(args))}));
    },[taskId]);

    const handleChangeClosure = React.useCallback((c) => {
        setQueryString(query => ({...query, closure: TASK_SET_CLOSURE_QUERY}));
        setJsonArgs(jsonArgs => ({...jsonArgs, closure:TASK_SET_CLOSURE_ARGS(taskId, c)}));
    }, [taskId]);

    const handleChangeOwner = React.useCallback((o) => {
        setQueryString(query => ({...query, owner: TASK_SET_OWNER_QUERY}));
        setJsonArgs(jsonArgs => ({...jsonArgs, owner: TASK_SET_OWNER_ARGS(taskId, o)}));
    }, [taskId]);

    const handleChange = (ky) => (
        ky === 'args' ? handleChangeArgs
            : ky === 'closure' ? handleChangeClosure
                : ky === 'owner' ? handleChangeOwner
                    : () => null
    );

    const handleSave = (ky) => () => {
        CollectionActions.query(
            scope,
            queryString[ky],
            tag,
            () => {
                TaskActions.getTask(scope, taskId, tag);
            },
            null,
            blob,
            jsonArgs[ky],
        );
    };

    return (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            {header.map((h) => task[h.ky] !== undefined && (
                <ViewEditFields
                    key={h.ky}
                    canEdit={h.canEdit}
                    editComponent={h.editComponent ? h.editComponent(task[h.eky], handleChange(h.ky)) : null}
                    label={h.label}
                    onSave={h.editComponent && handleSave(h.ky)}
                    viewComponent={h.viewComponent(task[h.ky])}
                />
            ))}
        </React.Fragment>
    );
};

EditTask.defaultProps = {
    taskId: null,
};

EditTask.propTypes = {
    taskId: PropTypes.number,
    scope: PropTypes.string.isRequired,

    /* tasks properties */
    task: TaskStore.types.task.isRequired,
};

export default withStores(EditTask);