/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ProcedureActions} from '../../../Stores';
import {AddClosure, ErrorMsg, SimpleModal} from '../../Util';


const tag = '5';

const useStyles = makeStyles(() => ({
    listItem: {
        // margin: 0,
        // padding: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },

}));

const AddTypeDialog = ({open, onClose, scope, cb}) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        queryString: '',
        procedureName: '',
        error: '',
        closure: '',
    });
    const {queryString, procedureName, error, closure} = state;


    React.useEffect(() => {
        setState({
            queryString: '',
            procedureName: '',
            error: '',
            closure: '',
        });
    },
    [open],
    );

    React.useEffect(() => {
        setState({...state, queryString: `new_procedure("${procedureName}", ${closure})`});
    },
    [procedureName, closure],
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, procedureName: value});
    };

    const handleClosure = (c) => {
        setState({...state, closure: c});
    };


    const handleClickOk = () => {
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
                            <ListItem className={classes.listItem}>
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
                                <AddClosure cb={handleClosure} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </SimpleModal>
        </React.Fragment>
    );
};


AddTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
};

export default AddTypeDialog;
