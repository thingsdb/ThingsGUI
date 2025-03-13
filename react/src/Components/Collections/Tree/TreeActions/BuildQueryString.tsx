import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { useEdit } from '../../../Utils';
import { LIST, NIL, SET, STR, THING } from '../../../../Constants/ThingTypes';
import {
    THING_LIST_EDIT_FORMAT_QUERY,
    THING_LIST_PUSH_FORMAT_QUERY,
    THING_PROP_EDIT_FORMAT_QUERY,
    THING_SET_ADD_FORMAT_QUERY,
} from '../../../../TiQueries/Queries';

const BuildQueryString = ({child, customTypes, enums, parent}: Props) => {
    const [editState, dispatch] = useEdit();
    const {val, query} = editState;

    const handleBuildQuery = React.useCallback((childType, childIndex, childName, parentId, parentName, parentType) => {
        let v;
        let q = '';
        v = input(val, childType);
        q = parentType===LIST ? (childIndex===null ? THING_LIST_PUSH_FORMAT_QUERY(parentId, parentName, v) : THING_LIST_EDIT_FORMAT_QUERY(parentId, parentName, childIndex, v))
            : parentType===THING ? THING_PROP_EDIT_FORMAT_QUERY(parentId, childName, v)
                : parentType===SET ? THING_SET_ADD_FORMAT_QUERY(parentId, parentName, v)
                    : [...customTypes.map(c=>c.name), ...enums.map(e=>e.name)].includes(parentType) ? THING_PROP_EDIT_FORMAT_QUERY(parentId, childName, v)
                        : '';
        dispatch(() => ({ query: q }));

    }, [customTypes, enums, dispatch, val]);

    React.useEffect(() => {
        handleBuildQuery(child.type, child.index, child.name, parent.id, parent.name, parent.type);
    }, [handleBuildQuery, val, child.type, child.index, child.name, parent.id, parent.name, parent.type]); // note: call handleBuildQuery when one of the items in the dependency array update. Not when handleBuildQuery updates. handleBuildQuery will be latest version when one of the items update. Unlike useCallback or useMemo; useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.

    const input = (childVal, childType) => {
        return childType == STR ? (childVal[0]=='\''? `${childVal}`:`'${childVal}'`)
            : childType == NIL ? NIL
                : `${childVal}`;
    };

    return(
        <TextField
            fullWidth
            label="Query"
            maxRows={4}
            multiline
            name="queryString"
            type="text"
            value={query}
            variant="standard"
            slotProps={{
                input: {
                    readOnly: true,
                    disableUnderline: true,
                },
                htmlInput: {
                    style: {
                        fontFamily: 'monospace',
                    },
                },
                inputLabel: {
                    shrink: true,
                }
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

interface Props {
    child: any;
    customTypes: IType[];
    enums: IEnum[];
    parent: any;
}