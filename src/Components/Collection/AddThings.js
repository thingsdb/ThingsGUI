import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
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

import {CollectionActions} from '../../Stores/CollectionStore';
import {Add1DArray, onlyNums} from '../Util';


const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    '_set',
    '_closure',
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

const AddThings = ({id, name, type, collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                queryString: '',
                newProperty: '',
                value: '',
                dataType: dataTypes[0],
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState(initialState);
    };

    const validation = {
        queryString: () => true,
        newProperty: () => true,
        value: () => {
            let bool = form.value.length>0;
            
            if (bool && form.dataType == 'number') {
                bool = onlyNums(form.value);
            }
            return(bool);
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
            return {...prevState, form: updatedForm};
        });
    }

    const handleBuildQuery = (key, value) => {
        let q = '';
        const propName = key=='newProperty' ? value : form.newProperty;
        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;

        const val = dataType === 'array' ? (type === 'array' ? `${input}` : `[${input}]`) 
        : dataType === 'object' ? `{}` 
        : dataType === 'string' ? `'${input}'`
        : dataType === 'number' ? `${input}` 
        : ''; 
  
        switch(type) {
            case 'array':
                q = `t(${id}).${name}.push(${val})`;
                break;
            case 'object':
                q = `t(${id}).${propName} = ${val}`;
                break;
            case 'set':
                q = `t(${id}).${name}.add(${val})`;
                break;
            default:
        };
        return(q);
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            CollectionActions.rawQuery(
                collection.collection_id,
                id, 
                form.queryString, 
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };
    

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
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>  
                    </DialogContentText>
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
                        {type !== 'array' ? (
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
                                    error={errors.newProperty}
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
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </ TextField>
                        </ListItem>    
                        
                        {form.dataType == 'number' || form.dataType == 'string' ? (
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
                                    error={errors.value}
                                />
                            </ListItem>

                        ) : form.dataType == 'array' ? (
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
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
};

export default AddThings;