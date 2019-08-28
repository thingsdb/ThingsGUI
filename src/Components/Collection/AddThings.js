import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, buildInput, buildQueryAdd, ErrorMsg, onlyNums, SimpleModal} from '../Util';


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
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;
    const {id, name, type} = info;

    const handleClickOpen = () => {
        const t = type == 'set' ?  dataTypes[3] : dataTypes[0];
        const q = type == 'set' ? buildQueryAdd(id, name, '{}', type): '';
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
        newProperty: () => thing[form.newProperty] ? 'Property name already in use' : '',
        value: () => {
            let errText;
            const bool = form.value.length>0;

            if (!bool && form.dataType == 'number') {
                errText = onlyNums(form.value) ? '' : 'only numbers';
            }
            return(errText);
        },
    };

    const handleBuildQuery = (key, value) => {
        const propName = key=='newProperty' ? value : form.newProperty;
        const n = type == 'object' ? propName : name;

        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        const val = buildInput(input, dataType);
        return buildQueryAdd(id, n, val, type);

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
    };

    const addNewProperty = !(type == 'array' || type == 'set');
    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';


    const Content = (
        <React.Fragment>
            <ErrorMsg error={serverError} onClose={handleCloseError} />
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
                    </TextField>
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
                    <Add1DArray cb={handleArrayItems} />
                ) : null}
            </List>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen} >
                    <AddBoxIcon color="primary" />
                </ButtonBase>
            }
            title="Add Thing"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

AddThings.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
};

export default AddThings;