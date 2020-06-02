/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core/styles';

import {InputField} from '../../CollectionsUtils';
import {LocalErrorMsg} from '../../../Util';
import BuildQueryString from './BuildQueryString';
import PropInit from './PropInit';
import TypeInit from './TypeInit';

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


const Edit = ({child, customTypes, enums, parent, thing, dataTypes}) => {
    const classes = useStyles();

    const [newProperty, setNewProperty] = React.useState('');
    const [dataType, setDataType] = React.useState(child.type=='list'||child.type=='thing' ? dataTypes[0]: child.type=='set' ? 'thing' : child.type);
    const [warnDescription, setWarnDescription] = React.useState('');


    const handleOnChangeName = (p) => {
        setNewProperty(p);
    };

    const handleOnChangeType = (t) => {
        setWarnDescription('');
        checkCircularRef(t, {});
        setDataType(t);
    };

    const addNewProperty = child.type == 'thing';//Boolean(child.id) && !(child.type.trim()[0] == '<')
    const canChangeType = child.type == 'thing' || child.type == 'list' || child.type == 'set' || child.type == 'nil';

    const customTypeNames = [...customTypes.map(c=>c.name)];
    const checkCircularRef = (type, circularRefFlag) => {
        if (!type.includes('?') && type[0] === '[' || type[0] === '{') {
            type = type.slice(1, -1);
        }
        if (customTypeNames.includes(type)) {
            if (circularRefFlag[type]) {
                setWarnDescription('Circular reference detected');
            } else {
                circularRefFlag[type] = true;
                customTypes.find(c=> c.name == type).fields.map(f=>checkCircularRef(f[1], {...circularRefFlag}));
            }
        }
    };


    const t = (child.type == 'thing' || child.type == 'list' || child.type == 'set') ? ''
        : child.type == 'closure' ? thing['/']
            : child.type == 'regex' ? thing['*']
                : child.type == 'error' ? `err(${thing.error_code}, '${thing.error_msg}')`
                    : thing;

    return(
        <List disablePadding dense className={classes.list}>
            <ListItem className={classes.listItem} >
                <BuildQueryString
                    child={{
                        id: null,
                        index: child.index,
                        name: child.type == 'thing'?newProperty:child.name,
                        type: dataType,
                    }}
                    customTypes={customTypes}
                    enums={enums}
                    parent={{
                        id: child.type == 'thing'? child.id:parent.id,
                        name: child.type == 'thing'|| child.type == 'list' || child.type == 'set' ?child.name:parent.name,
                        type: child.type == 'thing'|| child.type == 'list'|| child.type == 'set'?child.type:parent.type,
                    }}
                />
            </ListItem>
            <ListItem className={classes.listItem}>
                {addNewProperty && (
                    <PropInit
                        cb={handleOnChangeName}
                        input={newProperty}
                        thing={thing}
                    />
                )}
                {canChangeType && (
                    <TypeInit
                        cb={handleOnChangeType}
                        type={child.type}
                        customTypes={customTypes}
                        dataTypes={dataTypes}
                        input={dataType}
                    />
                )}
            </ListItem>
            {warnDescription ? (
                <LocalErrorMsg msgError={warnDescription} />
            ) : (
                <InputField dataType={dataType} enums={enums} margin="dense" customTypes={customTypes} dataTypes={dataTypes} label="Value" fullWidth init={t==null?'':t} />
            )}
        </List>
    );
};

Edit.defaultProps = {
    thing: null,
},

Edit.propTypes = {
    // cb: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
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