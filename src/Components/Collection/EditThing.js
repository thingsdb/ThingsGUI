import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/EditOutlined';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dropzone from 'react-dropzone';
import Typography from '@material-ui/core/Typography';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, buildInput, buildQueryEdit, ErrorMsg, onlyNums, SimpleModal} from '../Util';


const dataTypes = [
    'string',
    'number',
    'array',
    'object',
    'set',
    '___closure',
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
        fileName: '',
    },
};

const tag = '2';

const EditThing = ({info, collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;
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
                blob: '',
                fileName: '',
            },
        });
    };

    const handleClickClose = () => {
        setState(initialState);
    };

    const errorTxt = {
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
        const value = `${items}`;
        const q = handleBuildQuery('value', value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: value, queryString: q});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleDropzone = React.useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
            const binaryStr = reader.result;
            var encodedData = btoa(binaryStr);
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {blob: encodedData, fileName: acceptedFiles[0].name});
                return {...prevState, form: updatedForm, errors: {}};
            });
        };
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);


    const handleClickOk = () => {
        const err = Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            if (form.dataType== 'blob') {
                CollectionActions.blob(
                    collection,
                    id,
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
                    id,
                    form.queryString,
                    tag,
                    () => {
                        ThingsdbActions.getCollections();
                        setState({...state, show: false});
                    }
                );
            };
        }
    };

    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';
    const booleanInputField = form.dataType == 'boolean';
    const blobInputField = form.dataType == 'blob';

    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <List>
                <ListItem>
                    <ListItemText secondary={`WARNING: the current content of ${info.name} will be overwritten. This is irreversible.`} />
                </ListItem>
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
                ) : blobInputField ? (
                    <React.Fragment>
                        <ListItem>
                            <Dropzone onDrop={acceptedFiles => handleDropzone(acceptedFiles)}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p>
                                                {'Drag "n" drop some files here, or click to select files'}
                                            </p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </ListItem>
                        <Collapse in={Boolean(form.blob)} timeout="auto" unmountOnExit>
                            <ListItem>
                                <Typography variant="button" color="primary">
                                    {form.fileName}
                                </Typography>
                            </ListItem>
                        </Collapse>
                    </React.Fragment>
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
            title={`Edit Thing ${info.name}`}
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