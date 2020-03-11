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

import {InputField, useEdit} from '../CollectionsUtils';
import {ProcedureActions} from '../../../Stores';
import {allDataTypes, BoolInput, ErrorMsg, SimpleModal} from '../../Util';

const tag = '28';

const RunProcedureDialog = ({open, onClose, procedures, scope}) => {
    const [state, setState] = React.useState({
        convertArgs: false,
        procedureName: '',
    });
    const {convertArgs, procedureName} = state;
    const editState = useEdit()[0];
    const {val} = editState;
    console.log(val);

    const dataTypes = allDataTypes([]);


    React.useEffect(() => { // clean state
        setState({
            convertArgs: false,
            procedureName: '',
        });
    },
    [open],
    );

    const handleChangeProcedure = ({target}) => {
        const {value} = target;
        setState({...state, procedureName: value,});
    };

    const handleChangConvArgs = (b) => {
        setState({...state, convertArgs: b=='true'});
    };

    const handleResult = (data) => {
        console.log(data);
    };
    const handleClickOk = () => {
        ProcedureActions.runProcedure(
            scope,
            procedureName,
            val,
            convertArgs,
            tag,
            handleResult,
        );
    };

    const selectedProcedure = procedures.length && procedures.find(i => i.name == procedureName);
    return (
        <SimpleModal
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
                            {`Run procedure from the ${scope}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="procedureName"
                                label="Type"
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
                        {selectedProcedure && (
                            <React.Fragment>
                                <ListItem>
                                    <ListItemText primary="Arguments:" />
                                </ListItem>
                                {selectedProcedure.arguments.map(a=>(
                                    <ListItem key={a}>
                                        <InputField dataType="variable" dataTypes={dataTypes} identifier={a} />
                                    </ListItem>
                                ))}
                                <ListItem>
                                    <ListItemText primary="Convert arguments" />
                                </ListItem>
                                <ListItem>
                                    <BoolInput input={`${convertArgs}`} cb={handleChangConvArgs} />
                                </ListItem>
                            </React.Fragment>
                        )}
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};


RunProcedureDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedures: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default RunProcedureDialog;
