/*eslint-disable react/no-multi-comp*/
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { Closure, ErrorMsg, EditProvider, ViewEditFields } from '../../Utils';
import { CollectionActions, ProcedureActions } from '../../../Stores';
import { DATE_TIME_MIN_STR } from '../../../Constants/DateStrings';
import { EDIT_PROCEDURE_QUERY } from '../../../TiQueries/Queries';
import { EditProcedureDialogTAG } from '../../../Constants/Tags';
import { NEW_EDIT_PROCEDURE_ARGS } from '../../../TiQueries/Arguments';

const header = [
    {
        ky: 'created_at',
        label: 'Created at',
        canEdit: false,
        viewComponent: (at) => moment(at * 1000).format(DATE_TIME_MIN_STR),
    },
    {
        ky: 'doc',
        label: 'Documentation',
        canEdit: false,
        viewComponent: (doc) => doc,
    },
    {
        ky: 'arguments',
        label: 'Arguments',
        canEdit: false,
        viewComponent: (args) => `[${args}]`,
    },
    {
        ky: 'definition',
        label: 'Definition',
        canEdit: true,
        editComponent: (definition, onChange) => (
            <EditProvider>
                <Closure input={definition} onChange={onChange} />
            </EditProvider>
        ),
        viewComponent: (definition) => (
            definition ?
                <TextField
                    fullWidth
                    multiline
                    name="procedure"
                    type="text"
                    value={definition}
                    variant="standard"
                    slotProps={{
                        input: {
                            readOnly: true,
                            disableUnderline: true,
                        },
                        htmlInput: {
                            style: {
                                fontFamily: 'monospace',
                            },
                        },
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                : '-'),
    },
];

const tag = EditProcedureDialogTAG;

const EditProcedure = ({
    procedure = {},
    scope
}) => {
    const [queryString, setQueryString] = React.useState({definition: ''});
    const [jsonArgs, setJsonArgs] = React.useState('');

    const handleChangeDefinition = React.useCallback((c) => {
        setQueryString(query => ({...query, definition: EDIT_PROCEDURE_QUERY}));
        setJsonArgs(NEW_EDIT_PROCEDURE_ARGS(procedure.name, c));
    }, [procedure.name]);

    const handleChange = (ky) => (
        ky === 'definition' ? handleChangeDefinition
            : () => null
    );

    const handleSave = (ky) => () => {
        CollectionActions.query(
            scope,
            queryString[ky],
            tag,
            () => {
                ProcedureActions.getProcedures(scope, tag);
            },
            null,
            null,
            jsonArgs
        );
    };

    return (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            {header.map((h) => procedure[h.ky] !== undefined && (
                <ViewEditFields
                    key={h.ky}
                    canEdit={h.canEdit}
                    editComponent={h.editComponent ? h.editComponent(procedure[h.ky], handleChange(h.ky)) : null}
                    label={h.label}
                    onSave={h.editComponent && handleSave(h.ky)}
                    viewComponent={h.viewComponent(procedure[h.ky])}
                />
            ))}
        </React.Fragment>
    );
};

EditProcedure.propTypes = {
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditProcedure;