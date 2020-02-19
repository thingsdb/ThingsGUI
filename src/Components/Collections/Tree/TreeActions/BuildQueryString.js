import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from './Context';

const BuildQueryString = ({child, customTypes, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val, query} = editState;

    React.useEffect(() => {
        handleBuildQuery(child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type);
    }, [val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    const handleBuildQuery = (childType, childIndex, childId, childName, parentId, parentName, parentType) => {
        let v;
        let q = '';
        v = input(val, childType);
        q = buildQueryAdd(parentId, parentName, parentType, childName, childIndex, v);

        EditActions.update(dispatch, {
            query: q,
        });

    };

    const input = (childVal, childType) => {
        return childType == 'str' ? (childVal[0]=='\''? `${childVal}`:`'${childVal}'`)
            : childType == 'nil' ? 'nil'
                : `${childVal}`;
    };

    const buildQueryAdd = (parentId, parentName, parentType, childName, childIndex, value) => {
        return parentType==='list' ? (childIndex===null ? `#${parentId}.${parentName}.push(${value});` : `#${parentId}.${parentName}[${childIndex}] = ${value};`)
            : parentType==='thing' ? `#${parentId}.${childName} = ${value};`
                : parentType==='set' ? `#${parentId}.${parentName}.add(${value});`
                    : [...customTypes.map(c=>c.name)].includes(parentType) ? `#${parentId}.${childName} = ${value};`
                        : '';
    };

    return(
        <TextField
            name="queryString"
            label="Query"
            type="text"
            value={query}
            fullWidth
            multiline
            rowsMax={4}
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
    );
};

BuildQueryString.propTypes = {
    child: PropTypes.object.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.object.isRequired,
};

export default BuildQueryString;