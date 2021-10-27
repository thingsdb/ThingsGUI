import { amber } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Closure, EditName, ErrorMsg, SimpleModal } from '../../Utils';
import { CollectionActions, ProcedureActions } from '../../../Stores';
import { DATE_TIME_SEC_STR } from '../../../Constants/DateStrings';
import { EditProcedureDialogTAG } from '../../../Constants/Tags';


const tag = EditProcedureDialogTAG;
const EditProcedureDialog = ({button, open, onClose, procedure, scope}) => {
    const [queryString, setQueryString] = React.useState('');
    const [closure, setClosure] = React.useState('');

    React.useEffect(() => {
        if (open) {
            setClosure(procedure.definition);
            setQueryString(`del_procedure("${procedure.name}"); new_procedure("${procedure.name}", ${procedure.definition});`);
        }
    },
    [open, procedure.definition, procedure.name],
    );

    const handleClosure = (c) => {
        setClosure(c);
        setQueryString(`del_procedure("${procedure.name}"); new_procedure("${procedure.name}", ${c});`);
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            closure,
            tag,
            () => {
                handleSubmit();
            }
        );
    };


    const handleSubmit = () => {
        CollectionActions.query(
            scope,
            queryString,
            tag,
            () => {
                ProcedureActions.getProcedures(scope, tag);
                onClose();
            }
        );
    };

    const handleRename = (oldName, newName) => {
        ProcedureActions.renameProcedure(oldName, newName, scope, tag, onClose);
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
            actionButtons={procedure.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" sx={{color: amber[700]}}>
                        {'Note: this procedure generates an event.'}
                    </Typography>
                </ListItem>
            ):null}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB procedure:'}
                        </Typography>
                        <EditName name={procedure.name||''} fn={handleRename} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                {procedure.definition ? (
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
                                    {'Edit procedure:'}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Closure input={closure} onChange={handleClosure} />
                            </ListItem>
                            <ListItem>
                                <Grid container item xs={11} justifyContent="flex-end">
                                    <Box sx={{fontSize: 10, fontStyle: 'italic', m: 1}}>
                                        {`Created on: ${moment(procedure.created_at*1000).format(DATE_TIME_SEC_STR)}`}
                                    </Box>
                                </Grid>
                            </ListItem>
                        </List>
                    </Grid>
                ) : (
                    <Grid container spacing={1} item xs={12}>
                        <Grid item>
                            <Typography>
                                <Box sx={{fontSize: 16, fontStyle: 'italic', m: 1, color: 'text.secondary'}}>
                                    {'Procedure cannot be edited.'}
                                </Box>
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </SimpleModal>
    );
};

EditProcedureDialog.defaultProps = {
    button: null,
    procedure: {},
};

EditProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditProcedureDialog;
