import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const BuildQueryString = ({action, cb, child, customTypes, parent, showQuery, query, blob}) => {

    React.useEffect(() => {
        handleBuildQuery(action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type);
    }, [action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    const handleBuildQuery = (action, childVal, childType, childIndex, childId, childName, parentId, parentName, parentType) => {
        let val;
        let q = '';
        switch (action) {
        case 'edit':
            val = input(childVal, childType);
            q = buildQueryAdd(parentId, parentName, parentType, childName, childIndex, val);
            break;
        case 'remove':
            q = buildQueryRemove(parentId, parentName, parentType, childId, childName, childIndex);
            break;
        }
        cb(q);
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

BuildQueryString.defaultProps = {
    query: '',
    blob:{},
};

BuildQueryString.propTypes = {
    action: PropTypes.string.isRequired,
    blob: PropTypes.object,
    cb: PropTypes.func.isRequired,
    child: PropTypes.object.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.object.isRequired,
    showQuery: PropTypes.bool.isRequired,
    query: PropTypes.string,

};

export default BuildQueryString;