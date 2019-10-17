import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, AddBlob, AddBool, ErrorMsg, SimpleModal} from '../Util';


// ([\|]+[a-zA-Z\s,]+[\|]|[\|+\|])+[[:print:]][,](?!\|)


const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    'set',
    'closure',
    'boolean',
    'nil',
    'blob',
];

const initialState = {
    show: false,
    errors: {},
    form: {
        queryString: '',
        newProperty: '',
        value: '',
        dataType: dataTypes[0],
        blob: '',
    },
};

const tag = '1';

const AddEditContent = ({collection, errorTxt, handleBuildQuery, icon, isEdit, info, init}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                queryString: init.query,
                newProperty: init.propName?init.propName:'',
                value: '',
                dataType: isEdit?dataTypes[0]:info.type == 'set' ?  dataTypes[3] : dataTypes[0],
                blob: '',
            },
        });
    };

    const handleClickClose = () => {
        setState(initialState);
    };

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        const q = handleBuildQuery(name, value, form);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        const q = handleBuildQuery('value', value, form);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: value, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleBlob = (blob) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {blob: blob});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleBool = (bool) => {
        const q = handleBuildQuery('value', bool, form);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: bool, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(errorTxt(form)).reduce((d, ky) => { d[ky] = errorTxt(form)[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            if (form.dataType== 'blob') {
                CollectionActions.blob(
                    collection,
                    info.id,
                    form.queryString,
                    form.blob,
                    tag,
                    () => {
                        ThingsdbActions.getCollections();
                        setState({...state, show: false});
                    },
                );
            } else {
                CollectionActions.rawQuery(
                    collection,
                    info.id,
                    form.queryString,
                    tag,
                    () => {
                        ThingsdbActions.getCollections();
                        setState({...state, show: false});
                    }
                );
            }
        }
    };

    const addNewProperty = !(info.type == 'array' || info.type == 'set' || isEdit);
    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';
    const booleanInputField = form.dataType == 'boolean';
    const blobInputField = form.dataType == 'blob';
    const closureInputField = form.dataType == 'closure';


    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <List>
                <Collapse in={Boolean(form.queryString)} timeout="auto" unmountOnExit>
                    <ListItem>
                        <TextField
                            margin="dense"
                            name="queryString"
                            label="Query"
                            type="text"
                            value={form.queryString}
                            spellCheck={false}
                            onChange={handleOnChange}
                            fullWidth
                            error={Boolean(errors.queryString)}
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
                            margin="dense"
                            name="newProperty"
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
                        name="dataType"
                        label="Data type"
                        value={form.dataType}
                        onChange={handleOnChange}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                    >
                        {dataTypes.map(d => (
                            <option key={d} value={d} disabled={info.type=='set'&&d!='object'} >
                                {d}
                            </option>
                        ))}
                    </TextField>
                </ListItem>

                {singleInputField ? (
                    <ListItem>
                        <TextField
                            margin="dense"
                            name="value"
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
                    <Add1DArray cb={handleArrayItems} />
                ) : booleanInputField ? (
                    <ListItem>
                        <AddBool cb={handleBool} />
                    </ListItem>
                ) : blobInputField ? (
                    <ListItem>
                        <AddBlob cb={handleBlob} />
                    </ListItem>
                ) : closureInputField ? (
                    <React.Fragment>
                        <ListItem>
                            <TextField
                                margin="dense"
                                name="value"
                                label="Closure"
                                type="text"
                                value={form.value}
                                spellCheck={false}
                                onChange={handleOnChange}
                                fullWidth
                                placeholder="example: |x,y| x+y"
                                helperText={errors.closure}
                                error={Boolean(errors.closure)}
                            />
                        </ListItem>
                    </React.Fragment>
                ) : null}
            </List>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen} >
                    {icon}
                </ButtonBase>
            }
            title={isEdit?(info.index!=null ? `Edit ${info.name}[${info.index}]` : `Edit ${info.name}`):'Add Thing'}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

AddEditContent.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    errorTxt: PropTypes.func.isRequired,
    handleBuildQuery: PropTypes.func.isRequired,
    icon: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    init: PropTypes.object.isRequired,
};

export default AddEditContent;