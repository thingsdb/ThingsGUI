/* eslint-disable react/no-multi-comp */
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ProcedureActions} from '../../../Stores';
import {Closure, ErrorMsg, SimpleModal} from '../../Util';


const tag = '20';

const AddProcedureDialog = ({button, open, onClose, scope, cb}) => {
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
                            <TextField
                                name="procedureName"
                                label="Name"
                                type="text"
                                value={procedureName}
                                spellCheck={false}
                                onChange={handleChange}
                                fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <Typography variant="body1" >
                                {'Add closure:'}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Closure cb={handleClosure} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

AddProcedureDialog.defaultProps = {
    button: null,
    cb: ()=>null,
};

AddProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    cb: PropTypes.func,
};

export default AddProcedureDialog;
