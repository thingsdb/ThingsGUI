/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {InputField, useEdit} from '../../Collections/CollectionsUtils';
import {ProcedureActions} from '../../../Stores';
import {addDoubleQuotesAroundKeys, changeSingleToDoubleQuotes, ErrorMsg, SimpleModal, QueryOutput} from '../../Util';
import {RunProcedureDialogTAG} from '../../../constants';

const useStyles = makeStyles(() => ({
    warnColor: {
        color: amber[700],
    },
}));

const tag = RunProcedureDialogTAG;
const dataTypes = ['str', 'int', 'float', 'bool', 'nil', 'list', 'thing']; // Supported types

const RunProcedureDialog = ({button, open, onClose, procedure, scope}) => {
    const classes = useStyles();
    const [output, setOutput] = React.useState('');
    const editState = useEdit()[0];
    const {val} = editState;


    React.useEffect(() => { // clean state
        setOutput('');
    },
    [open],
    );

    const handleResult = (data) => {
        setOutput(data);
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
    };
    const handleClickOk = () => {
        const jsonProof = changeSingleToDoubleQuotes(addDoubleQuotesAroundKeys(val)); // make it json proof
        ProcedureActions.runProcedure(
            scope,
            procedure.name,
            jsonProof,
            tag,
            handleResult,
        );
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
                            <Typography variant="caption" className={classes.warnColor}>
                                {'Note: this procedure generates an event.'}
                            </Typography>
                        </ListItem>
                    )}
                    <Button color="primary" onClick={handleClickOk}>
                        {'Run'}
                    </Button>
                </React.Fragment>
            }
            maxWidth="md"
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
                        <React.Fragment>
                            {procedure.arguments&&procedure.arguments.length!==0 && (
                                <React.Fragment>
                                    <ListItem>
                                        <ListItemText primary="Arguments:" primaryTypographyProps={{variant: 'body1'}} />
                                    </ListItem>
                                    <ListItem>
                                        <InputField dataType="variable" dataTypes={dataTypes} variables={procedure.arguments} />
                                    </ListItem>
                                </React.Fragment>
                            )}
                            <ListItem>
                                <ListItemText primary="Output:" primaryTypographyProps={{variant: 'body1'}} />
                            </ListItem>
                            <div id="output">
                                <QueryOutput output={output} />
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
