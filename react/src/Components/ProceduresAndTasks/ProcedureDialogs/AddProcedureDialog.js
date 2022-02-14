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

import {AddProcedureDialogTAG} from '../../../Constants/Tags';
import {Closure, ErrorMsg, SimpleModal} from '../../Utils';
import {CollectionActions, ProcedureActions} from '../../../Stores';
import {THINGS_DOC_NEW_PROCEDURE} from '../../../Constants/Links';
import { NEW_PROCEDURE_EMPTY_QUERY, NEW_PROCEDURE_QUERY, NEW_PROCEDURE_FORMAT_QUERY } from '../../../TiQueries';


const tag = AddProcedureDialogTAG;
const initState = {
    closure: '',
    error: '',
    jsonArgs: [],
    procedureName: '',
    queryString: NEW_PROCEDURE_EMPTY_QUERY,
};

const query = NEW_PROCEDURE_QUERY;

const AddProcedureDialog = ({open, onClose, scope}) => {
    const [state, setState] = React.useState(initState);
    const {closure, error, jsonArgs, procedureName, queryString} = state;

    React.useEffect(() => { // clean state
        setState(initState);
    }, [open]);

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, procedureName: value, jsonArgs: `{"name": "${value}", "closure": "${closure}"}`, queryString: NEW_PROCEDURE_FORMAT_QUERY(value, closure)});
    };

    const handleClosure = (c) => {
        setState({...state, closure: c, jsonArgs: `{"name": "${procedureName}", "closure": "${c}"}`, queryString: NEW_PROCEDURE_FORMAT_QUERY(procedureName, c)});
    };


    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            query,
            tag,
            () => {
                ProcedureActions.getProcedures(scope, tag);
                onClose();
            },
            null,
            null,
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
                            {'Customizing ThingDB procedure:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {'Add new procedure'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <Collapse in={Boolean(queryString)} timeout="auto">
                            <ListItem>
                                <ListItemText
                                    primary="For more information, see:"
                                    secondary={
                                        <Link target="_blank" href={THINGS_DOC_NEW_PROCEDURE}>
                                            {'ThingsDocs'}
                                        </Link>
                                    }
                                />
                            </ListItem>
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
                            <TextField
                                autoFocus
                                fullWidth
                                label="Name"
                                name="procedureName"
                                onChange={handleChange}
                                spellCheck={false}
                                type="text"
                                value={procedureName}
                                variant="standard"
                            />
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" >
                                {'Add closure:'}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Closure onChange={handleClosure} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

AddProcedureDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default AddProcedureDialog;
