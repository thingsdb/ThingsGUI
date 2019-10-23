import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {withVlow} from 'vlow';

import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, AddBlob, AddBool, buildInput, buildQueryAdd, buildQueryEdit, ErrorMsg, onlyNums, SimpleModal} from '../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

// ([\|]+[a-zA-Z\s,]+[\|]|[\|+\|])+[[:print:]][,](?!\|)


// const dataTypes = [
//     'string',
//     'number',
//     'array',
//     'object',
//     'set',
//     'closure',
//     'boolean',
//     'nil',
//     'blob',
// ];

// const initialState = {
//     show: false,
//     errors: {},
//     form: {
//         queryString: '',
//         newProperty: '',
//         value: '',
//         dataType: dataTypes[0],
//         blob: '',
//     },
// };

const tag = '1';

const AddEditContent = ({collection, handleBuildQuery, icon, isEdit, info, init, thing, customTypes}) => {
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
        ...Object.keys(customTypes)
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
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    React.useEffect(() => {
        TypeActions.getTypes(`@collection:${collection.name}`, tag);
    }, []);

    const errorTxt = {
        queryString: () => '',
        newProperty: () => isEdit ? '' : thing[form.newProperty] ? 'property name already in use' : '',
        value: () => {
            const bool = form.value.length>0;
            let errText = bool?'':'is required';
            switch (form.dataType) {
            case 'number':
                if (bool) {
                    errText = onlyNums(form.value) ? '' : 'only numbers';
                }
                return(errText);
            case 'closure':
                if (bool) {
                    errText = /^((?:\|[a-zA-Z\s]*(?:[,][a-zA-Z\s]*)*\|)|(?:\|\|))(?:(?:[\s]|[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>])*[a-zA-Z0-9,.\*\/+%\-=&\|^?:;!<>]+)$/.test(form.value) ? '':'closure is not valid';
                }
                return(errText);
            default:
                return '';
            }
        },
    };

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

    const standardType = (type, customTypes) => {
        switch (true) {
        case type.includes('str'):
            return('\'\'');
        case type.includes('int'):
            return('0');
        case type.includes('float'):
            return('0.0');
        case type.includes('bool'):
            return('false');
        case type.includes('thing'):
            return('{}');
        case type.includes('['):
            return(`[${makeTypeInstanceInit(type.substring(1,type.length-1),customTypes)}]`);
        default:
            return '';
        }

    };

    const makeTypeInstanceInit = (key, customTypes) => customTypes[key] ?
        `${key}{${Object.entries(customTypes[key]).map(([k, v]) =>`${k}: ${makeTypeInstanceInit(v, customTypes)}` )}}`
        : standardType(key, customTypes);


    const handleOnChange = ({target}) => {
        const {name, value} = target;
        if (name == 'dataType' && customTypes.hasOwnProperty(value)) { // incase of custom-type
            const val = makeTypeInstanceInit(value, customTypes);
            const q = handleBuildQuery(name, value, {...form, value: val});
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {dataType: value, value: val, queryString: q});
                return {...prevState, form: updatedForm};
            });
        } else {
            const q = handleBuildQuery(name, value, form);
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {[name]: value, queryString: q});
                return {...prevState, form: updatedForm, errors: {}};
            });

        }
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
        const err = Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
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
                                helperText={errors.value}
                                error={Boolean(errors.value)}
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

AddEditContent.defaultProps = {
    thing: null,
},

AddEditContent.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    handleBuildQuery: PropTypes.func.isRequired,
    icon: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    init: PropTypes.object.isRequired,
    thing: PropTypes.any,

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(AddEditContent);