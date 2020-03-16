/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {EditActions, InputField, useEdit} from '../Collections/CollectionsUtils';
import {ProcedureActions} from '../../Stores';
import {addDoubleQuotesAroundKeys, BoolInput, ErrorMsg, SimpleModal, QueryOutput} from '../Util';

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const tag = '28';
const dataTypes = ['str', 'int', 'float', 'bool', 'nil', 'list', 'thing']; // Supported types

const RunProcedureDialog = ({button, open, onClose, procedure, procedures, scope}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        convertArgs: false,
        enableInts: true,
        openInfoConvArgs: false,
        openInfoInts: false,
        output: '',
        procedureName: '',
    });
    const {convertArgs, enableInts, openInfoConvArgs, openInfoInts, output, procedureName} = state;
    const [editState, dispatch] = useEdit();
    const {val} = editState;


    React.useEffect(() => { // clean state
        setState({
            convertArgs: false,
            enableInts: true,
            procedureName: '',
            output: '',
        });
    },
    [open],
    );

    const handleClickInfoConvArgs = () => {
        setState({...state, openInfoConvArgs: !openInfoConvArgs});
    };

    const handleClickInfoInts = () => {
        setState({...state, openInfoInts: !openInfoInts});
    };

    const handleChangeProcedure = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, {val: '', array: [], blob: {}});
        setState({...state, procedureName: value});
    };

    const handleChangeConvArgs = (b) => {
        setState({...state, convertArgs: b=='true'});
    };
    const handleChangeEnableInts = (b) => {
        setState({...state, enableInts: b=='true'});
    };

    const handleResult = (data) => {
        setState({...state, output: data});
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
    };
    const handleClickOk = () => {
        const jsonProof = addDoubleQuotesAroundKeys(val); // make it json proof
        ProcedureActions.runProcedure(
            scope,
            procedureName,
            jsonProof,
            convertArgs,
            enableInts,
            tag,
            handleResult,
        );
    };

    const selectedProcedure = procedure ? procedure : procedures.length && procedures.find(i => i.name == procedureName);
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
                            {`Run procedure ${procedure?procedure.name:null}: ${scope}`}
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
                                <ListItem>
                                    <ListItemText primary="Arguments:" />
                                </ListItem>
                                <ListItem>
                                    <InputField dataType="variable" dataTypes={dataTypes} variables={selectedProcedure.arguments} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Get property values by ThingID"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={handleClickInfoConvArgs}>
                                            <InfoIcon color="primary" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Collapse in={openInfoConvArgs} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                secondary="This guarantees that the procedure works with the latest version of the thing's properties, otherwise the procedure works with the properties supplied. Using the thing's ID prevents working with property values that are outdated"
                                                secondaryTypographyProps={{
                                                    variant:'caption',
                                                    component:'div'
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                </Collapse>
                                <ListItem>
                                    <BoolInput input={`${convertArgs}`} cb={handleChangeConvArgs} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Support integer values"
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={handleClickInfoInts}>
                                            <InfoIcon color="primary" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Collapse in={openInfoInts} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                secondary="Integer values will not be converted to floats."
                                                secondaryTypographyProps={{
                                                    variant:'caption',
                                                    component:'div'
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                </Collapse>
                                <ListItem>
                                    <BoolInput input={`${enableInts}`} cb={handleChangeEnableInts} />
                                </ListItem>
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
