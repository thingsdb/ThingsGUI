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
    const [value, setValue] = React.useState(
        child.type == 'thing' ? ''
            : child.type == 'closure' ? thing['/']
                : child.type == 'regex' ? thing['*']
                    : child.type == 'error' ? `err(${thing.error_code}, ${thing.error_msg})`
                        : child.type == 'list' ? ''
                            : thing);
    const [blob, setBlob] = React.useState('');
    const [custom, setCustom] = React.useState({});
    const [queryString, setQueryString] = React.useState('');
    const [error, setError] = React.useState('');
    const [newProperty, setNewProperty] = React.useState('');
    const [dataType, setDataType] = React.useState(child.type=='list'||child.type=='thing' ? dataTypes[0]: child.type=='set' ? 'thing' : child.type);


    React.useEffect(() => {
        cb(queryString, blob, error);
    },
    [queryString, blob],
    );

    const errorTxt = (property) => thing[property] ? 'property name already in use' : '';

    const handleOnChangeName = ({target}) => {
        const {value} = target;
        const err = errorTxt(value);
        setError(err);
        setNewProperty(value);
    };

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
    };

    const handleQuery = (q) => {
        setQueryString(q);
    };

    const handleVal = (v) => {
        if (dataType=='bytes') {
            setBlob(v);
        } else {
            setValue(v);
        }
    };

    const handleCustom = (c) => {
        setCustom(prev => {
            const updatedVal = Object.assign({}, prev, c);
            return updatedVal;
        });
    };

    const addNewProperty = Boolean(child.id);
    const canChangeType = child.type == 'thing' || child.type == 'list' || child.type == 'set';
    const isCustomType = customTypes.hasOwnProperty(dataType);

    return(
        <React.Fragment>
            <List disablePadding dense>
                <Collapse in={Boolean(queryString)} timeout="auto">
                    <ListItem className={classes.listItem} >
                        <BuildQueryString
                            action="edit"
                            cb={handleQuery}
                            child={{
                                id: null,
                                index: child.index,
                                name: child.id?newProperty:child.name,
                                type: dataType,
                                val: isCustomType?custom:value,
                            }}
                            customTypes={customTypes}
                            parent={{
                                id: child.id||parent.id,
                                name: child.id || child.type == 'list' || child.type == 'set' ?child.name:parent.name,
                                type: child.id|| child.type == 'list'|| child.type == 'set'?child.type:parent.type,
                            }}
                            showQuery
                            query={queryString}
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
                            value={newProperty}
                            spellCheck={false}
                            onChange={handleOnChangeName}
                            fullWidth
                            helperText={error}
                            error={Boolean(error)}
                        />
                    </ListItem>
                ) : null}
                {canChangeType ? (
                    <ListItem className={classes.listItem}>
                        <TextField
                            margin="dense"
                            autoFocus
                            name="dataType"
                            label="Data type"
                            value={dataType}
                            onChange={handleOnChangeType}
                            fullWidth
                            select
                            SelectProps={{native: true}}
                        >
                            {dataTypes.map(d => (
                                <option key={d} value={d} disabled={child.type=='set'&&!(d=='thing'||customTypes.hasOwnProperty(d))} >
                                    {d}
                                </option>
                            ))}
                        </TextField>
                    </ListItem>
                ) : null}
                {isCustomType ? (
                    <EditCustom
                        name={child.id?newProperty:child.name}
                        type={dataType}
                        customTypes={customTypes}
                        cb={handleCustom}
                    />
                ) : (
                    <ListItem className={classes.listItem}>
                        <InputField name="Value" dataType={dataType} cb={handleVal} input={child.type=='error'?thing:value} margin="dense" />
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
    customTypes: PropTypes.object.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Edit;