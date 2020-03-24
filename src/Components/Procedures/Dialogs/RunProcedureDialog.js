/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {EditActions, InputField, useEdit} from '../../Collections/CollectionsUtils';
import {ProcedureActions} from '../../../Stores';
import {addDoubleQuotesAroundKeys, changeSingleToDoubleQuotes, ErrorMsg, SimpleModal, QueryOutput} from '../../Util';

const tag = '22';
const dataTypes = ['str', 'int', 'float', 'bool', 'nil', 'list', 'thing']; // Supported types

const RunProcedureDialog = ({button, open, onClose, procedure, procedures, scope}) => {
    const [state, setState] = React.useState({
        output: '',
        procedureName: '',
    });
    const {output, procedureName} = state;
    const [editState, dispatch] = useEdit();
    const {val} = editState;


    React.useEffect(() => { // clean state
        setState({
            procedureName: procedure?procedure.name:(procedures&&procedures.length?procedures[0].name:''),
            output: '',
        });
    },
    [open],
    );

    const handleChangeProcedure = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
        setState({...state, procedureName: value});
    };

    const handleResult = (data) => {
        setState({...state, output: data});
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
    };
    const handleClickOk = () => {
        const jsonProof = changeSingleToDoubleQuotes(addDoubleQuotesAroundKeys(val)); // make it json proof
        ProcedureActions.runProcedure(
            scope,
            procedure&&procedure.name||procedureName,
            jsonProof,
            tag,
            handleResult,
        );
    };

    console.log(procedures, procedure)

    const selectedProcedure = procedure ? procedure : procedures && procedures.find(i => i.name == procedureName);
    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            actionButtons={
                <Button color="primary" onClick={handleClickOk}>
                    {'Run'}
                </Button>
            }
            maxWidth="md"
            // disableOk={Boolean(error)}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h4" color='primary' component='span'>
                            {`Run procedure${procedure?`: ${procedure.name}`:''}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        {procedures && (
                            <ListItem>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="procedureName"
                                    label="Procedure"
                                    value={procedureName}
                                    onChange={handleChangeProcedure}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    select
                                    SelectProps={{native: true}}
                                >
                                    {procedures.map((p,i) => (
                                        <option key={i} value={p.name}>
                                            {p.name}
                                        </option>
                                    ))}
                                </TextField>
                            </ListItem>
                        )}
                        {selectedProcedure && (
                            <React.Fragment>
                                {selectedProcedure.arguments&&selectedProcedure.arguments.length!==0 && (
                                    <React.Fragment>
                                        <ListItem>
                                            <ListItemText primary="Arguments:" />
                                        </ListItem>
                                        <ListItem>
                                            <InputField dataType="variable" dataTypes={dataTypes} variables={selectedProcedure.arguments} />
                                        </ListItem>
                                    </React.Fragment>
                                )}
                                <ListItem>
                                    <ListItemText primary="Output:" />
                                </ListItem>
                                <div id="output">
                                    <QueryOutput output={output} />
                                </div>
                            </React.Fragment>
                        )}
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

RunProcedureDialog.defaultProps = {
    button: null,
    procedure: null,
    procedures: null,
};


RunProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    procedures: PropTypes.arrayOf(PropTypes.object),
    scope: PropTypes.string.isRequired,
};

export default RunProcedureDialog;
