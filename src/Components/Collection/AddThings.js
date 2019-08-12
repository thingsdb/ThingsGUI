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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import AddArray from './_AddArray';
import {CollectionActions} from '../../Stores/CollectionStore';

const initialState = {
    show: false,
    errors: {},
    form: {},
    switches: {
        newProperty: false,
    },
    serverError: '',
};

const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    'set',
];

const AddThings = ({collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, switches, serverError} = state;

    console.log(thing);

    React.useEffect(() => {
            if (!switches.newProperty) {
                const thingType = checkType(thing[form.propertyName])
                setState(prevState => {
                    const updatedForm = Object.assign({}, prevState.form, { 'dataType': thingType});
                    return {...prevState, form: updatedForm};
                });
            }
        },
        [form.propertyName],
    );

    const checkType = (t) => {
        let type = typeof(t);
        if (type === 'object') {
            type = Array.isArray(t) ? 'array' : 'object'
            if (type === 'object') {
                kindOfObject = Object.keys(t)[0];
                type = kindOfObject === '#' ? 'object' : (kindOfObject === '$' ? 'set' : null )
            }    
        }
        return(type);
    };

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                queryString: '',
                newProperty: '',
                value: '',
                propertyName: Object.keys(thing)[1],
                dataType: dataTypes[0],
            },
            switches: {
                newProperty: false,
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };


    const onlyNums = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;
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
        propertyName: () => true,
    };

    const handleSwitch = ({target}) => {
        const {id, checked} = target;
        switches[id] = checked;
        setState({...state, switches});
    }

 
    const handleOnChange = ({target}) => {
        const {id, value} = target;
        const q = handleBuildQuery(id, value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value, 'queryString': q});
            return {...prevState, form: updatedForm};
        });
    };

    const handleBuildQuery = (key, value) => {
        console.log(key, value);
        let q = '';
        const propName = key=='newProperty' ? value : (switches.newProperty ? form.newProperty : form.propertyName);
        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        switch(dataType) {
            case 'string':
                q = `t(${thing['#']}).${propName} = '${input}'`;
              break;
            case 'number':
                q = `t(${thing['#']}).${propName} = ${input}`;
                break;
            case 'array':
                break;
            case 'object':
                break;
            case 'set':
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
                thing['#'], 
                form.queryString, 
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };


    // const handleDynamicInput = (idName, labelName, idValue, labelValue) => (
    //     <React.Fragment>
    //         <ListItem>
    //             <TextField
    //                 margin="dense"
    //                 id={idName}
    //                 label={labelName}
    //                 type="text"
    //                 value={form.value}
    //                 spellCheck={false}
    //                 onChange={handleOnChange}
    //                 fullWidth
    //             />
    //         </ListItem>                        
    //         <ListItem>
    //             <TextField
    //                 margin="dense"
    //                 id={idValue}
    //                 label={labelValue}
    //                 type="text"
    //                 value={form.value}
    //                 spellCheck={false}
    //                 onChange={handleOnChange}
    //                 fullWidth
    //             />
    //         </ListItem>
    //     </React.Fragment>
    // );

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
                    {'Add Property'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>  
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="queryString"
                                label="Query"
                                type="text"
                                value={form.queryString}
                                spellCheck={false}
                                onChange={handleOnChange}
                                fullWidth
                                error={errors.queryString}
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
                        <ListItem>
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={switches.newProperty}
                                        color="primary"
                                        id="newProperty"
                                        onChange={handleSwitch}
                                    />
                                )}
                                label="Add new property"
                            />
                        </ListItem>
                        <Collapse in={!switches.newProperty} timeout="auto" unmountOnExit>
                            <ListItem>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="propertyName"
                                    label="Existing properties"
                                    value={form.propertyName}
                                    onChange={handleOnChange}
                                    fullWidth
                                    select
                                    SelectProps={{native: true}}
                                >
                                    {Object.entries(thing).map(([k, v]) => (
                                        k == '#' ? null :
                                        <option key={k} value={k}>
                                            {k}
                                        </option>
                                    ))}
                                </ TextField>
                            </ListItem>
                        </ Collapse>    
                        <Collapse in={switches.newProperty} timeout="auto" unmountOnExit>
                            <ListItem>
                                <TextField
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
                        </Collapse>
                        <ListItem>
                            <TextField
                                autoFocus
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
                        <ListItem>
                            {dataType == 'number' || dataType == 'string' ? (
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

                            ) : dataType == 'array' ? (
                                <AddArray />
                            ) : null}

                        </ListItem>
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
    collection: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired,
};

export default AddThings;