import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {withVlow} from 'vlow';

import BuildQueryString from './BuildQueryString';
import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {Add1DArray, AddBlob, AddBool, ErrorMsg, onlyNums, SimpleModal} from '../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = '1';

const AddEditContent = ({scope, icon, isEdit, info, thing, customTypes}) => {
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
        TypeActions.getTypes(scope, tag);
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
                queryString: '',
                newProperty: isEdit ? info.name:'',
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
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleQuery = (q) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {queryString: q});
            return {...prevState, form: updatedForm};
        });
    };

    const handleArrayItems = (items) => {
        const value = `${items}`;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: value});
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
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {value: bool});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            if (form.dataType== 'blob') {
                CollectionActions.blob(
                    scope,
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
                    scope,
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
                <Collapse in={Boolean(form.queryString)} timeout="auto">
                    <ListItem>
                        <BuildQueryString
                            action={isEdit?'edit':'add'}
                            cb={handleQuery}
                            child={{
                                id: null,
                                index: info.index,
                                name: isEdit?info.name:form.newProperty,
                                type: form.dataType,
                                val: form.value,
                            }}
                            customTypes={customTypes}
                            parent={{
                                id: info.id,
                                name: info.name,
                                type: isEdit?info.parentType:info.type,
                            }}
                            showQuery
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
    scope: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    thing: PropTypes.any,

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(AddEditContent);