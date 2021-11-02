/*eslint-disable react/no-multi-comp*/
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { EditTaskDialogTAG } from '../../../Constants/Tags';
import { CollectionActions, TaskActions } from '../../../Stores';
import { Closure, ErrorMsg, EditProvider, nextRunFn, parseError, ViewEditFields } from '../../Utils';
import { NIL } from '../../../Constants/DateStrings';
import { SetArguments, SetOwner } from '../Utils';

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
        viewComponent: (args) => `[${args}]`,
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

const EditTask = ({task, scope}) => {
    const [queryString, setQueryString] = React.useState({args: '', closure: '', owner: ''});
    const [blob, setBlob] = React.useState({});

    const handleChangeArgs = React.useCallback((args, blob) => {
        setBlob(blob);
        setQueryString(query => ({...query, args: `task(${task.id}).set_args([${replaceNull(args)}]);`}));
    },[task.id]);

    const handleChangeClosure = React.useCallback((c) => {
        setQueryString(query => ({...query, closure: ` task(${task.id}).set_closure(${c});`}));
    }, [task.id]);

    const handleChangeOwner = React.useCallback((o) => {
        setQueryString(query => ({...query, owner: ` task(${task.id}).set_owner('${o}');`}));
    }, [task.id]);

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
                TaskActions.getTasks(scope, tag);
            },
            null,
            blob,
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
    task: {},
};

EditTask.propTypes = {
    task: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditTask;