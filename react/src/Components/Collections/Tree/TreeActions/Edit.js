import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';

import { DATETIME, ERROR, LIST, NIL, SET, THING, TIMEVAL } from '../../../../Constants/ThingTypes';
import { InputField } from '../../../Utils';
import BuildQueryString from './BuildQueryString';
import PropInit from './PropInit';
import TypeInit from './TypeInit';


const Edit = ({child, customTypes, dataTypes, enums, parent, scope, thing}) => {
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
        <List disablePadding dense>
            <ListItem>
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
                        name: child.type == THING || child.type == LIST || child.type == SET ?child.name:parent.name,
                        type: child.type == THING || child.type == LIST || child.type == SET?child.type:parent.type,
                    }}
                />
            </ListItem>
            <ListItem>
                <Grid container item xs={12} spacing={1} justifyContent="flex-start">
                    {addNewProperty && (
                        <Grid item xs={3}>
                            <PropInit
                                onChange={handleOnChangeName}
                                input={newProperty}
                                thing={thing}
                            />
                        </Grid>
                    )}
                    {canChangeType && (
                        <Grid item xs={3}>
                            <TypeInit
                                onChange={handleOnChangeType}
                                type={child.type}
                                customTypes={customTypes}
                                dataTypes={dataTypes}
                                input={dataType}
                            />
                        </Grid>
                    )}
                </Grid>
            </ListItem>
            <ListItem>
                <InputField
                    customTypes={customTypes}
                    dataType={dataType}
                    dataTypes={dataTypes}
                    enums={enums}
                    fullWidth
                    init={t == null ? '' : t}
                    label="Value"
                    margin="dense"
                    variant="standard"
                />
            </ListItem>
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