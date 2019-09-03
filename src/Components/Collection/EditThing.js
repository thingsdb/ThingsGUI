import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, buildInput, buildQueryEdit, ErrorMsg, onlyNums, SimpleModal} from '../Util';


const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    'set',
    'closure',
    'boolean',
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

const EditThing = ({info, collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;
    const {id, index, name, parentType} = info;


    const handleClickOpen = () => {
        const q = parentType == 'set' ? buildQueryEdit(id, name, '{}', parentType, index): '';
        setState({
            show: true,
            errors: {},
            form: {
                queryString: q,
                newProperty: name,
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
        queryString: () => '',
        newProperty: () => form.newProperty == name ? '' : thing[form.newProperty] ? 'Property name already in use' : '',
        value: () => {
            let errText;
            const bool = form.value.length>0;

            if (!bool && form.dataType == 'number') {
                errText = onlyNums(form.value) ? '' : 'only numbers';
            } else if (!errText && form.dataType == 'boolean') {
                errText = form.value == 'true' || form.value == 'false' ? '' : 'not a boolean value';
            }
            return(errText);
        },
    };

    const handleBuildQuery = (key, value) => {
        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        const val = buildInput(input, dataType);
        return buildQueryEdit(id, name, val, parentType, index);

    };

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        const q = handleBuildQuery(name, value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value, queryString: q});
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

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';
    const booleanInputField = form.dataType == 'boolean';



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
                            <option key={d} value={d} disabled={parentType=='set'&&d!='object'} >
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
                        <RadioGroup aria-label="position" name="value" value={form.value} onChange={handleOnChange} row >
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="true"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="primary" />}
                                label="false"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </ListItem>
                ) : null}
            </List>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen} >
                    <EditIcon color="primary" />
                </ButtonBase>
            }
            title="Edit Thing"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

EditThing.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
};

export default EditThing;