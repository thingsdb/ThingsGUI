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


const tag = AddProcedureDialogTAG;

const AddProcedureDialog = ({open, onClose, scope}) => {
    const [state, setState] = React.useState({
        queryString: 'new_procedure("", )',
        procedureName: '',
        error: '',
        closure: '',
    });
    const {queryString, procedureName, error, closure} = state;


    React.useEffect(() => { // clean state
        setState({
            queryString: 'new_procedure("", )',
            procedureName: '',
            error: '',
            closure: '',
        });
    },
    [open],
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, procedureName: value, queryString: `new_procedure("${value}", ${closure})`});
    };

    const handleClosure = (c) => {
        setState({...state, closure: c, queryString: `new_procedure("${procedureName}", ${c})`});
    };


    const handleClickOk = () => {
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
