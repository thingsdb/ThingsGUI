import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {EditActions, useEdit} from '../../CollectionsUtils/Context';

const BuildQueryString = ({child, customTypes, enums, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val, query} = editState;

    React.useEffect(() => {
        handleBuildQuery(child.type, child.index, child.name, parent.id, parent.name, parent.type);
    }, [handleBuildQuery, val, child.type, child.index, child.name, parent.id, parent.name, parent.type]); // note: call handleBuildQuery when one of the items in the dependency array update. Not when handleBuildQuery updates. handleBuildQuery will be latest version when one of the items update. Unlike useCallback or useMemo; useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.

    const handleBuildQuery = React.useCallback((childType, childIndex, childName, parentId, parentName, parentType) => {
        let v;
        let q = '';
        v = input(val, childType);
        q = parentType==='list' ? (childIndex===null ? `#${parentId}.${parentName}.push(${v});` : `#${parentId}.${parentName}[${childIndex}] = ${v};`)
            : parentType==='thing' ? `#${parentId}.${childName} = ${v};`
                : parentType==='set' ? `#${parentId}.${parentName}.add(${v});`
                    : [...customTypes.map(c=>c.name), ...enums.map(e=>e.name)].includes(parentType) ? `#${parentId}.${childName} = ${v};`
                        : '';

        EditActions.update(dispatch, {
            query: q,
        });

    }, [customTypes, enums, dispatch, val]);

    const input = (childVal, childType) => {
        return childType == 'str' ? (childVal[0]=='\''? `${childVal}`:`'${childVal}'`)
            : childType == 'nil' ? 'nil'
                : `${childVal}`;
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
    enums: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.object.isRequired,
};

export default BuildQueryString;