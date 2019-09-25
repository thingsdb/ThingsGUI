import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dropzone from 'react-dropzone';
import Typography from '@material-ui/core/Typography';

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

const tag = '1';

const AddThings = ({info, collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;
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
                blob: '',
                fileName: '',
            },
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
            } else if (!errText && form.dataType == 'boolean') {
                errText = form.value == 'true' || form.value == 'false' ? '' : 'not a boolean value';
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



    // const readFileAsArrayBuffer = (file, success, error) => {
    //     let fr = new FileReader();
    //     fr.addEventListener('error', error, false);
    //     if (fr.readAsBinaryString) {
    //         fr.addEventListener('load', function () {
    //             let bin = new Uint8Array(fr.result.length);
    //             for (let i = 0; i < fr.result.length; i++) {
    //                 bin[i] = fr.result.charCodeAt(i);
    //             }
    //             success(bin.buffer);
    //         }, false);
    //         return fr.readAsBinaryString(file);
    //     } else {
    //         fr.addEventListener('load', function () {
    //             success(fr.result);
    //         }, false);
    //         return fr.readAsArrayBuffer(file);
    //     }
    // };

    // const handleClickLoad = () => {
    //     setState(prevState => {
    //         const updatedForm = Object.assign({}, prevState.form, {loading: true});
    //         return {...prevState, form: updatedForm};
    //     });
    //     setTimeout(() => {
    //         readFileAsArrayBuffer(fileRef.current.files[0], function(data) {
    //             let int8Array = new Int8Array(data);
    //             let output = JSON.stringify(int8Array, null, '  ');
    //             setState(prevState => {
    //                 const updatedForm = Object.assign({}, prevState.form, {loading: false, blob: int8Array}); // check this!
    //                 return {...prevState, form: updatedForm};
    //             });


    //             console.log(array, output);
    //         }, function (e) {
    //             setState(prevState => {
    //                 const updatedForm = Object.assign({}, prevState.form, {loading: false});
    //                 return {...prevState, form: updatedForm};
    //             });
    //             console.error(e);
    //         });
    //     }, 1000);

    // };

    const handleDropzone = React.useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            // let bin = new Uint8Array(reader.result.length);
            // for (let i = 0; i < reader.result.length; i++) {
            //     bin[i] = reader.result.charCodeAt(i);
            // }
            // let output = JSON.stringify(bin, null, '  ');
            // console.log(bin, bin.buffer);
            var encodedData = btoa(binaryStr);
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {blob: encodedData, fileName: acceptedFiles[0].name});
                return {...prevState, form: updatedForm};
            });
        };

        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky]();  return d; }, {});
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
            }
        }
    };

    const addNewProperty = !(type == 'array' || type == 'set');
    const singleInputField = form.dataType == 'number' || form.dataType == 'string';
    const multiInputField = form.dataType == 'array';
    const booleanInputField = form.dataType == 'boolean';
    const blobInputField = form.dataType == 'blob';


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

AddThings.defaultProps = {
    thing: null,
},

AddThings.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any,
};

export default AddThings;