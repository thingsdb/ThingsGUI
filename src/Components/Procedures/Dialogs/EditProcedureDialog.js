/* eslint-disable react/no-multi-comp */
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
import {Closure, ErrorMsg, SimpleModal} from '../../Util';


const tag = '21';
const EditProcedureDialog = ({button, open, onClose, procedure, scope, cb}) => {
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
        CollectionActions.rawQuery(
            scope,
            closure,
            tag,
            (_data) => {
                handleSubmit();
            }
        );
    };


    const handleSubmit = () => {
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            (_data) => {
                ProcedureActions.getProcedures(scope, tag, cb);
                onClose();
            }
        );
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="sm"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB procedure:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {procedure.name||''}
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
                                <TextField
                                    name="queryString"
                                    label="Query"
                                    type="text"
                                    value={queryString}
                                    fullWidth
                                    multiline
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
                                {'Add closure:'}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Closure input={closure} cb={handleClosure} />
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
            </Grid>
        </SimpleModal>
    );
};

EditProcedureDialog.defaultProps = {
    button: null,
    procedure: {},
    cb: () => null,
};

EditProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
    cb: PropTypes.func,
};

export default EditProcedureDialog;
