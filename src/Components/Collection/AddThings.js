import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, onlyNums} from '../Util';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
}));

const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    'set',
    'closure',
];

const initialState = {
    show: false,
    errors: {},
    form: {
        queryString: '',
        newProperty: '',
        value: '',
        dataType: dataTypes[0],
    },
    serverError: '',
};

const AddThings = ({info, collection, thing}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;
    const {id, name, type} = info;

    const handleClickOpen = () => {
        const t = type == 'set' ?  dataTypes[3] : dataTypes[0];
        const q = type == 'set' ? buildQuery(id, name, '{}', type): '';
        setState({
            show: true,
            errors: {},
            form: {
                queryString: q,
                newProperty: '',
                value: '',
                dataType: t,
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState(initialState);
    };
    
    const validation = {
        queryString: () => '',
        newProperty: () => Boolean(thing[form.newProperty]) ? 'Property name already in use' : '',
        value: () => {
            let errText;
            const bool = form.value.length>0;
            
            if (!bool && form.dataType == 'number') {
                errText = onlyNums(form.value) ? '' : 'only numbers';
            }
            return(errText);
        },
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        const q = handleBuildQuery(id, value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleArrayItems = (items) => {
        const value = items.toString();
        const q = handleBuildQuery('value', value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: value, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleBuildQuery = (key, value) => {
        const propName = key=='newProperty' ? value : form.newProperty;
        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;

        const val = dataType === 'array' ? `[${input}]`
        : dataType == 'object' ? `{}` 
        : dataType == 'string' ? `'${input}'`
        : dataType == 'number' ? `${input}` 
        : dataType == 'set' ? `set([])` 
        : ''; 

        const n = type == 'object' ? propName : name;
        return buildQuery(id, n, val, type);
        
    };

    const buildQuery = (i, n, v, t) => {
        return t==='array' ? `t(${i}).${n}.push(${v})`
            : t==='object' ? `t(${i}).${n} = ${v}`
            : t==='set' ? `t(${i}).${n}.add(${v})`
            : '';
    };


    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            CollectionActions.rawQuery(
                collection.collection_id,
                id, 
                form.queryString, 
                (err) => setState({...state, serverError: err.log})
            );
            
            ThingsdbActions.getCollections((err) => setState({...state, serverError: err.log}));

            if (!state.serverError) { // QUEST? Is serverError already known here?
                setState({...state, show: false});
            }
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }
    
    const addNewProperty = !(type == 'array' || type == 'set');
    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';


    console.log(type);

    return (
        <React.Fragment>
            <ButtonBase onClick={handleClickOpen} >
                <AddBoxIcon color={'primary'}/>
            </ButtonBase>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Add thing'}
                </DialogTitle>
                <DialogContent>
                    <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid item><Avatar className={classes.avatar}><WarningIcon className={classes.warning}/></Avatar></Grid>
                                <Grid item>{serverError}</Grid>
                                <Grid item> 
                                    <IconButton aria-label="settings" onClick={handleCloseError}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Collapse>
                    <List>
                        <Collapse in={Boolean(form.queryString)} timeout="auto" unmountOnExit>
                            <ListItem>
                                <TextField
                                    margin="dense"
                                    id="queryString"
                                    label="Query"
                                    type="text"
                                    value={form.queryString}
                                    spellCheck={false}
                                    onChange={handleOnChange}
                                    fullWidth
                                    error={errors.queryString}
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
                        {addNewProperty ? (
                            <ListItem>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="newProperty"
                                    label="New property"
                                    type="text"
                                    value={form.newProperty}
                                    spellCheck={false}
                                    onChange={handleOnChange}
                                    fullWidth
                                    helperText={errors.newProperty}
                                    error={Boolean(errors.newProperty)}
                                />
                            </ListItem>
                        ) : null}

                        <ListItem>
                            <TextField
                                margin="dense"
                                id="dataType"
                                label="Data type"
                                value={form.dataType}
                                onChange={handleOnChange}
                                fullWidth
                                select
                                SelectProps={{native: true}}
                            >
                                {dataTypes.map(d => ( 
                                    <option key={d} value={d} disabled={type=='set'&&d!='object'} >
                                        {d}
                                    </option>
                                ))}
                            </ TextField>
                        </ListItem>    
                        
                        {singleInputField ? (
                            <ListItem>
                                <TextField
                                    margin="dense"
                                    id="value"
                                    label="Value"
                                    type="text"
                                    value={form.value}
                                    spellCheck={false}
                                    onChange={handleOnChange}
                                    fullWidth
                                    helperText={errors.value}
                                    error={Boolean(errors.value)}
                                />
                            </ListItem>

                        ) : multiInputField ? (
                            <Add1DArray cb={handleArrayItems}/>
                        ) : null}              
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

AddThings.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
};

export default AddThings;