import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';

import {InputField} from '../../CollectionsUtils';
import BuildQueryString from './BuildQueryString';
import PropInit from './PropInit';
import TypeInit from './TypeInit';
import {DATETIME, ERROR, LIST, NIL, SET, THING, TIMEVAL} from '../../../../Constants/ThingTypes';

const useStyles = makeStyles(theme => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
    list: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}));


const Edit = ({child, customTypes, dataTypes, enums, parent, scope, thing}) => {
    const classes = useStyles();

    const [newProperty, setNewProperty] = React.useState('');
    const [dataType, setDataType] = React.useState(child.type==LIST||child.type==THING ? dataTypes[0]: child.type==SET ? THING : child.type);

    const handleOnChangeName = (p) => {
        setNewProperty(p);
    };

    const handleOnChangeType = (t) => {
        setDataType(t);
    };

    const addNewProperty = child.type == THING;
    const canChangeType = child.type == THING || child.type == LIST || child.type == SET || child.type == NIL;

    const t = (child.type == THING || child.type == LIST || child.type == SET) ? ''
        : child.type == ERROR ? {propName: child.name, parentId: parent.id, scope: scope}
            : child.type == DATETIME ? `datetime("${thing}")`
                :child.type == TIMEVAL ? `timeval(${thing})`
                    : thing;

    return(
        <List disablePadding dense className={classes.list}>
            <ListItem className={classes.listItem}>
                <BuildQueryString
                    child={{
                        id: null,
                        index: child.index,
                        name: child.type == THING?newProperty:child.name,
                        type: dataType,
                    }}
                    customTypes={customTypes}
                    enums={enums}
                    parent={{
                        id: child.type == THING? child.id:parent.id,
                        name: child.type == THING|| child.type == LIST || child.type == SET ?child.name:parent.name,
                        type: child.type == THING|| child.type == LIST|| child.type == SET?child.type:parent.type,
                    }}
                />
            </ListItem>
            <ListItem className={classes.listItem}>
                {addNewProperty && (
                    <PropInit
                        onChange={handleOnChangeName}
                        input={newProperty}
                        thing={thing}
                    />
                )}
                {canChangeType && (
                    <TypeInit
                        onChange={handleOnChangeType}
                        type={child.type}
                        customTypes={customTypes}
                        dataTypes={dataTypes}
                        input={dataType}
                    />
                )}
            </ListItem>
            <InputField dataType={dataType} enums={enums} margin="dense" customTypes={customTypes} dataTypes={dataTypes} label="Value" fullWidth init={t==null?'':t} />
        </List>
    );
};

Edit.defaultProps = {
    thing: null,
},

Edit.propTypes = {
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
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default Edit;