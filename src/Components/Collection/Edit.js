import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core/styles';

import BuildQueryString from './BuildQueryString';
import EditCustom from './EditCustom';
import InputField from './InputField';

const useStyles = makeStyles(() => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const Edit = ({child, customTypes, parent, thing, dataTypes, cb}) => {
    const classes = useStyles();
    const initialState = {
        error: '',
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
    const {error, form} = state;

    React.useEffect(() => {
        cb(form.queryString, form.blob, error);
    },
    [form.queryString, form.blob],
    );

    const errorTxt = (property) => thing[property] ? 'property name already in use' : '';

    const handleOnChangeName = ({target}) => {
        const {name, value} = target;
        const err = errorTxt(value);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value});
            return {...prevState, form: updatedForm, error: err};
        });
    };

    const handleOnChangeType = ({target}) => {
        const {name, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[name]: value});
            return {...prevState, form: updatedForm};
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
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {value: v});
                return {...prevState, form: updatedForm};
            });
        }
    };

    const handleCustom = (c) => {
        setState(prevState => {
            const updatedVal = Object.assign({}, prevState.form.custom, c);
            const updatedForm = Object.assign({}, prevState.form, {custom: updatedVal});
            return {...prevState, form: updatedForm};
        });
    };

    const addNewProperty = Boolean(child.id);
    const isCustomType = customTypes.hasOwnProperty(form.dataType);
    console.log(child, parent);

    const input = child.type == 'thing' ? '' : child.type == 'closure' ? thing['>'] : thing;

    return(
        <React.Fragment>
            <List disablePadding dense>
                <Collapse in={Boolean(form.queryString)} timeout="auto">
                    <ListItem className={classes.listItem} >
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
                                name: child.id || child.type == 'array'?child.name:parent.name,
                                type: child.id|| child.type == 'array'?child.type:parent.type,
                            }}
                            showQuery
                        />
                    </ListItem>
                </Collapse>
                {addNewProperty ? (
                    <ListItem className={classes.listItem}>
                        <TextField
                            margin="dense"
                            name="newProperty"
                            label="New property"
                            type="text"
                            value={form.newProperty}
                            spellCheck={false}
                            onChange={handleOnChangeName}
                            fullWidth
                            helperText={error}
                            error={Boolean(error)}
                        />
                    </ListItem>
                ) : null}

                <ListItem className={classes.listItem}>
                    <TextField
                        margin="dense"
                        name="dataType"
                        label="Data type"
                        value={form.dataType}
                        onChange={handleOnChangeType}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                        disabled={child.type != 'thing' && child.type != 'array'}
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
                        cb={handleCustom}
                    />
                ) : (
                    <ListItem className={classes.listItem}>
                        <InputField name="Value" dataType={form.dataType} cb={handleVal} input={input} />
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
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Edit;