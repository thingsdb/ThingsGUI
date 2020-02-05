import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from './Context';

const BuildQueryString = ({action, child, customTypes, parent, showQuery}) => {
    const [editState, dispatch] = useEdit();
    const {val, query} = editState;

    console.log(val)

    React.useEffect(() => {
        handleBuildQuery(action, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type);
    }, [action, val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    const handleBuildQuery = (action, childType, childIndex, childId, childName, parentId, parentName, parentType) => {
        let v;
        let q = '';
        switch (action) {
        case 'edit':
            v = input(val, childType);
            q = buildQueryAdd(parentId, parentName, parentType, childName, childIndex, v);
            break;
        case 'remove':
            q = buildQueryRemove(parentId, parentName, parentType, childId, childName, childIndex);
            break;
        }

        EditActions.update(dispatch, {
            query: q,
        });

    };

    //STANDARD\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

    const buildQueryRemove = (parentId, parentName, parentType, childId, childName, childIndex) => {
        return parentType === 'thing' ? `#${parentId}.del('${childName}');`
            : parentType === 'set' ? `#${parentId}.${parentName}.remove(#${parentId}.${parentName}.find(|s| (s.id()==${childId}) ));`
                : `#${parentId}.${parentName}.splice(${childIndex}, 1);`;
    };

    return(
        <React.Fragment>
            {showQuery ? (
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
            ) : null}
        </React.Fragment>
    );
};

BuildQueryString.propTypes = {
    action: PropTypes.string.isRequired,
    child: PropTypes.object.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.object.isRequired,
    showQuery: PropTypes.bool.isRequired,
};

export default BuildQueryString;