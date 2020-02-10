/* eslint-disable react/no-multi-comp */

import {makeStyles} from '@material-ui/core/styles';
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


const tag = '12';

const useStyles = makeStyles(theme => ({
    listItem: {
        // margin: 0,
        // padding: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    popover: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.warning,
    },

}));

const EditProcedureDialog = ({open, onClose, procedure, scope, cb}) => {
    const classes = useStyles();
    const [queryString, setQueryString] = React.useState('');
    const [closure, setClosure] = React.useState('');

    React.useEffect(() => {
        if (open) {
            setClosure(procedure.definition);
        }
    },
    [JSON.stringify(procedure)], // TODO STRING
    );

    React.useEffect(() => {
        setQueryString(`del_procedure("${procedure.name}"); new_procedure("${procedure.name}", ${closure});`);
    },
    [procedure.name, closure],
    );

    const handleClosure = (c) => {
        setClosure(c);
    };

    const handleClickOk = () => {
        // check if no error in syntax
        CollectionActions.rawQuery(
            scope,
            closure,
            tag,
            () => {
                handleSubmit();
            }
        );
    };


    const handleSubmit = () => {
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            () => {
                ProcedureActions.getProcedures(scope, tag, cb);
                onClose();
            }
        );
    };

    return (
        <React.Fragment>
            <SimpleModal
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
                                <ListItem className={classes.listItem} >
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
        </React.Fragment>
    );
};

EditProcedureDialog.defaultProps = {
    procedure: {},
};

EditProcedureDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
};

export default EditProcedureDialog;
