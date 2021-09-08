import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ProcedureActions} from '../../../Stores';
import {Closure, EditName, ErrorMsg, SimpleModal} from '../../Util';
import {EditProcedureDialogTAG} from '../../../Constants/Tags';

const useStyles = makeStyles(() => ({
    warnColor: {
        color: amber[700],
    },
}));

const tag = EditProcedureDialogTAG;
const EditProcedureDialog = ({button, open, onClose, procedure, scope}) => {
    const classes = useStyles();
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
                    <Typography variant="caption" className={classes.warnColor}>
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
                                        name="queryString"
                                        label="Query"
                                        type="text"
                                        value={queryString}
                                        fullWidth
                                        multiline
                                        rowsMax="10"
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
                                <Grid container item xs={11} justify="flex-end">
                                    <Box fontSize={10} fontStyle="italic" m={1}>
                                        {`Created on: ${moment(procedure.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                                    </Box>
                                </Grid>
                            </ListItem>
                        </List>
                    </Grid>
                ) : (
                    <Grid container spacing={1} item xs={12}>
                        <Grid item>
                            <Typography variant="subtitle1" >
                                {'Procedure cannot be edited.'}
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
