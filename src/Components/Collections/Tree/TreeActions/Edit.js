import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core/styles';

import {EditActions, useEdit} from './Context';
import BuildQueryString from './BuildQueryString';
import InputField from './InputField';
import {LocalErrorMsg} from '../../../Util';

const useStyles = makeStyles(theme => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
    list: {
        '@global': {
            '*::-webkit-scrollbar': {
                width: '0.4em'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.primary.main,
                outline: '1px solid slategrey'
            }
        },
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}));


const Edit = ({child, customTypes, parent, thing, dataTypes}) => {
    const classes = useStyles();
    const [editState, dispatch] = useEdit();
    const {val, query, error} = editState;

    const [newProperty, setNewProperty] = React.useState('');
    const [dataType, setDataType] = React.useState(child.type=='list'||child.type=='thing' ? dataTypes[0]: child.type=='set' ? 'thing' : child.type);
    const [warnDescription, setWarnDescription] = React.useState('');


    const errorTxt = (property) => thing[property] ? 'property name already in use' : '';

    const handleOnChangeName = ({target}) => {
        const {value} = target;
        const err = errorTxt(value);
        EditActions.update(dispatch, {
            error: err,
        });
        setNewProperty(value);
    };

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        setWarnDescription('');
        checkCircularRef(value, {});
        EditActions.update(dispatch, {
            val: '',
            blob: {},
        });
        setDataType(value);
    };


    const addNewProperty = Boolean(child.id) && !(child.type.trim()[0] == '<');
    const canChangeType = child.type == 'thing' || child.type == 'list' || child.type == 'set' || child.type == 'nil';

    const customTypeNames = [...customTypes.map(c=>c.name)];


    const checkCircularRef = (type, circularRefFlag) => {
        if (type[0] === '[' || type[0] === '{') {
            type = type.slice(1, -1);
        }
        if (customTypeNames.includes(type)) {
            if (circularRefFlag[type]) {
                setWarnDescription(`Circular reference detected in type ${type}. `);
            } else {
                circularRefFlag[type] = true;
                customTypes.find(c=> c.name == type).fields.map(f=>checkCircularRef(f[1], circularRefFlag));
            }
        }
    };

    return(
        <React.Fragment>
            <List disablePadding dense className={classes.list}>
                <Collapse in={Boolean(query)} timeout="auto">
                    <ListItem className={classes.listItem} >
                        <BuildQueryString
                            action="edit"
                            child={{
                                id: null,
                                index: child.index,
                                name: child.id?newProperty:child.name,
                                type: dataType,
                                val: val,
                            }}
                            customTypes={customTypes}
                            parent={{
                                id: child.id||parent.id,
                                name: child.id || child.type == 'list' || child.type == 'set' ?child.name:parent.name,
                                type: child.id|| child.type == 'list'|| child.type == 'set'?child.type:parent.type,
                            }}
                            showQuery
                        />
                    </ListItem>
                </Collapse>
                <ListItem className={classes.listItem}>
                    {addNewProperty && (
                        <TextField
                            margin="dense"
                            name="newProperty"
                            label="New property"
                            type="text"
                            value={newProperty}
                            spellCheck={false}
                            onChange={handleOnChangeName}
                            helperText={error}
                            error={Boolean(error)}
                        />
                    )}
                    {canChangeType && (
                        <TextField
                            margin="dense"
                            autoFocus
                            name="dataType"
                            label="Data type"
                            value={dataType}
                            onChange={handleOnChangeType}
                            select
                            SelectProps={{native: true}}
                        >
                            {dataTypes.map(d => (
                                <option key={d} value={d} disabled={child.type=='set'&&!(d=='thing'||Boolean(customTypes.find(c=>c.name==d)))} >
                                    {d}
                                </option>
                            ))}
                        </TextField>
                    )}
                </ListItem>
                {warnDescription ? (
                    <LocalErrorMsg msgError={warnDescription} />
                ) : (
                    <InputField dataType={dataType} margin="dense" customTypes={customTypes} dataTypes={dataTypes} name={newProperty} label="Value" fullWidth />
                )}
            </List>
        </React.Fragment>
    );
};

Edit.defaultProps = {
    thing: null,
},

Edit.propTypes = {
    // cb: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
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