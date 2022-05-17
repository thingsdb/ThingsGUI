import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { ProcedureActions } from '../../../Stores';
import { ErrorMsg, InputField, QueryOutput, SendButton, SimpleModal, useEdit } from '../../Utils';
import { RunProcedureDialogTAG } from '../../../Constants/Tags';
import { BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL, VARIABLE } from '../../../Constants/ThingTypes';

const tag = RunProcedureDialogTAG;
const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types

const RunProcedureDialog = ({button, open, onClose, procedure, scope}) => {
    const [output, setOutput] = React.useState('');
    const [tabIndex, setTabIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const editState = useEdit()[0];
    const {obj} = editState;

    React.useEffect(() => { // clean state
        setOutput('');
    },[open]);

    const handleResult = (data) => {
        setOutput(data);
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
        setTimeout(()=> {
            setLoading(false);
        }, 750);
    };

    const handleClickOk = () => {
        setLoading(true);
        ProcedureActions.runProcedure(
            scope,
            procedure.name,
            obj,
            tag,
            handleResult,
            () => {
                setTimeout(()=> {
                    setLoading(false);
                }, 750);
            }
        );
    };

    const handleChangeTab = (newValue) => {
        setTabIndex(newValue);
    };


    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            actionButtons={
                <React.Fragment>
                    {procedure.with_side_effects&&(
                        <ListItem>
                            <Typography variant="caption" sx={{color: amber[700]}}>
                                {'Note: this procedure generates an event.'}
                            </Typography>
                        </ListItem>
                    )}
                    <SendButton
                        label="Run"
                        loading={loading}
                        onClickSend={handleClickOk}
                        variant="text"
                    />
                </React.Fragment>
            }
            maxWidth="md"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Run ThingDB procedure:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {procedure.name || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <React.Fragment>
                            {procedure.arguments&&procedure.arguments.length!==0 && (
                                <React.Fragment>
                                    <ListItem>
                                        <ListItemText primary="Arguments:" primaryTypographyProps={{variant: 'body1'}} />
                                    </ListItem>
                                    <ListItem>
                                        <InputField dataType={VARIABLE} dataTypes={dataTypes} variables={procedure.arguments} />
                                    </ListItem>
                                </React.Fragment>
                            )}
                            <ListItem>
                                <ListItemText primary="Output:" primaryTypographyProps={{variant: 'body1'}} />
                            </ListItem>
                            <div id="output">
                                <QueryOutput output={output} tabIndex={tabIndex} onChangeTab={handleChangeTab} />
                            </div>
                        </React.Fragment>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

RunProcedureDialog.defaultProps = {
    button: null,
    procedure: {},
};


RunProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default RunProcedureDialog;
