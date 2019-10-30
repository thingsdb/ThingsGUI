import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import BuildQueryString from './BuildQueryString';
import EditCustom from './EditCustom';
import InputField from './InputField';
import {onlyNums} from '../Util';


const Edit = ({child, customTypes, parent, thing, dataTypes, cb}) => {
    const initialState = {
        errors: {},
        form: {
            queryString: '',
            newProperty: '',
            dataType: child.type,
            value: '',
            blob: '',
            custom: {},
            thing: {},
            array: [],
        },
    };
    const [state, setState] = React.useState(initialState);
    const {errors, form} = state;

    React.useEffect(() => {
        if (!Object.values(errors).some(d => d)) {
            cb(form.queryString, form.blob);
        }
    },
    [form.queryString, form.blob],
    );

    const errorTxt = {
        newProperty: () => thing[form.newProperty] ? 'property name already in use' : '',
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
        // custom: () => {

        // },
    };

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        const err = Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value});
            return {...prevState, form: updatedForm, errors: err};
        });
    };

    const handleQuery = (q) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {queryString: q});
            return {...prevState, form: updatedForm};
        });
    };

    const handleVal = (v) => {
        if (form.dataType=='blob') {
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {blob: v});
                return {...prevState, form: updatedForm};
            });
        } else {
            const err = Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {value: v});
                return {...prevState, form: updatedForm, errors: err};
            });
        }
    };

    const handleCustom = (c) => {
        setState(prevState => {
            const updatedVal = Object.assign({}, prevState.form.custom, c);
            const updatedForm = Object.assign({}, prevState.form, {custom: updatedVal});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const addNewProperty = Boolean(child.id);
    const isCustomType = customTypes.hasOwnProperty(form.dataType);

    return(
        <React.Fragment>
            <List disablePadding dense>
                <Collapse in={Boolean(form.queryString)} timeout="auto">
                    <ListItem>
                        <BuildQueryString
                            action="edit"
                            cb={handleQuery}
                            child={{
                                id: null,
                                index: child.index,
                                name: child.id?form.newProperty:child.name,
                                type: form.dataType,
                                val: isCustomType?form.custom:form.value,
                            }}
                            customTypes={customTypes}
                            parent={{
                                id: child.id||parent.id,
                                name: child.id?child.name:parent.name,
                                type: child.id?child.type:parent.type,
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
                            <option key={d} value={d} disabled={parent.type=='set'&&d!='thing'} >
                                {d}
                            </option>
                        ))}
                    </TextField>
                </ListItem>
                {isCustomType ? (
                    <EditCustom
                        name={child.id?form.newProperty:child.name}
                        type={form.dataType}
                        customTypes={customTypes}
                        errors={errors}
                        cb={handleCustom}
                    />
                ) : (
                    <ListItem>
                        <InputField name="Value" dataType={form.dataType} error={errors.value} cb={handleVal} />
                    </ListItem>
                )}
            </List>
        </React.Fragment>
    );
};

Edit.defaultProps = {
    thing: null,
},

Edit.propTypes = {
    cb: PropTypes.func.isRequired,
    child: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
    customTypes: PropTypes.object.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Edit;