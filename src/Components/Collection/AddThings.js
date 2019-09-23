import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    },
};

const tag = '1';

const AddThings = ({info, collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;
    const {id, name, type} = info;
    const fileRef = React.useRef(null);

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

    const toBlob = (file) => {
        var r = new FileReader();
        r.onload = function(){

            // var bufArr = new ArrayBuffer(r.result.length);
            // var bufView = new Uint8Array(bufArr);
            // for (let i = 0; i < r.result.length; i++) {
            //     bufView[i] = r.result[i];
            // }
            // var str = ab2str(bufArr);

            // var enc = new TextDecoder("utf-8");
            // var arr = new Uint8Array([84,104,105,115,32,105,115,32,97,32,85,105,110,116,
            //                         56,65,114,114,97,121,32,99,111,110,118,101,114,116,
            //                         101,100,32,116,111,32,97,32,115,116,114,105,110,103]);
            // console.log(enc.decode(arr));

            var bufView = new Int8Array(r.result);
            var output = JSON.stringify(bufView, null, '  ');
            console.log(output);

        };
        // r.readAsBinaryString(file);
        r.readAsArrayBuffer(file);
        //return r.result;
    };

    // function readFileAsArrayBuffer(file, success, error) {
    //     var fr = new FileReader();
    //     fr.addEventListener('error', error, false);
    //     if (fr.readAsBinaryString) {
    //         fr.addEventListener('load', function () {
    //             var string = this.resultString != null ? this.resultString : this.result;
    //             var result = new Uint8Array(string.length);
    //             for (var i = 0; i < string.length; i++) {
    //                 result[i] = string.charCodeAt(i);
    //             }
    //             success(result.buffer);
    //         }, false);
    //         return fr.readAsBinaryString(file);
    //     } else {
    //         fr.addEventListener('load', function () {
    //             success(this.result);
    //         }, false);
    //         return fr.readAsArrayBuffer(file);
    //     }
    // }

    // readFileAsArrayBuffer(input.files[0], function(data) {
    //     var array = new Int8Array(data);
    //     output.value = JSON.stringify(array, null, '  ');
    //     window.setTimeout(ReadFile, 1000);
    // }, function (e) {
    //     console.error(e);
    // });

    // const ab2str = (buf) => {
    //     return String.fromCharCode.apply(null, new Uint8Array(buf));
    // }

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            if (form.dataType== 'blob') {
                const d = toBlob(fileRef.current.files[0]);
                console.log(fileRef.current.files[0], d);
                CollectionActions.rawQuery(
                    collection,
                    id,
                    form.queryString,
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
                    <ListItem>
                        <input type="file" ref={fileRef}  />
                    </ListItem>
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