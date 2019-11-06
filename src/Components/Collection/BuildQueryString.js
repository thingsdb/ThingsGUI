import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const BuildQueryString = ({action, cb, child, customTypes, parent, showQuery}) => {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        handleBuildQuery(action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type, parent.isSet);
    }, [action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type, parent.isSet]);

    React.useEffect(() => {
        cb(query);
    }, [query]);


    const handleBuildQuery = (action, childVal, childType, childIndex, childId, childName, parentId, parentName, parentType, parentIsSet) => {
        let val;
        let q = '';
        switch (action) {
        case 'edit':
            if (customTypes.hasOwnProperty(childType)) { // incase of custom-type
                val = customTypeInput(childName, childType, customTypes, childVal);
            } else {
                val = standardInput(childVal, childType);
            }
            q = buildQueryAdd(parentId, childName, parentName, val, parentType, childIndex);
            break;
        case 'remove':
            q = buildQueryRemove(parentName, parentId, childName, childIndex, childId, parentIsSet);
            break;
        }
        setQuery(q);
    };


    const mapArrayInput = (n, t, customTypes, value) => {
        const v = Array.isArray(value) ?
            value.map((v, i) => customTypeInput(name, v.type, customTypes, v))
            : customTypeInput(name, t.substring(1,t.length-1), customTypes, value);
        return v;
    };

    const createArrayInput = (name, type, customTypes, val) => `[${mapArrayInput(name, type, customTypes, val)}]`;

    const setTypeInput = (n, t, customTypes, val) => {
        const v = val&&val.hasOwnProperty('val') ? val.val : val||'';
        return t.includes('str') ? `'${v}'`
            : t.includes('int') || t.includes('float') || t.includes('bool') ? `${v}`
                : t.includes('thing') ? '{}' // TODO
                    : t.includes('[') ? createArrayInput(n, t, customTypes, v)
                        : t.includes('{') ? `set(${createArrayInput(n, t, customTypes, v)})`//'set([{}])' // TODO
                            : '';
    };

    const mapTypeInput = (nam, typ, customTypes, val) => Object.entries(customTypes[typ]).map(([k, t]) => {
        const v = val&&val.hasOwnProperty('val') ? val.val : val;
        const value = Array.isArray(v)&&v.length ? v.find(({ name, type }) => name === k && type === t) : v;
        return ` ${k}: ${customTypeInput(k, t, customTypes, value)}`;
    });

    const customTypeInput = (name, type, customTypes, val) => {
        return customTypes[type] ?
            `${type}{${mapTypeInput(name, type, customTypes, val)}}` : setTypeInput(name, type, customTypes, val);
    };

    const standardInput = (childVal, childType) => {
        return childType === 'array' ? `[${childVal}]`
            : childType == 'thing' ? '{}'
                : childType == 'string' ? `'${childVal}'`
                    : childType == 'number' || childType == 'boolean' ? `${childVal}`
                        : childType == 'set' ? 'set({})'
                            : childType == 'nil' ? 'nil'
                                : childType == 'blob' ? 'blob'
                                    : childType == 'closure' ? childVal
                                        : '';
    };

    const buildQueryAdd = (parentId, childName, parentName, value, parentType, childIndex) => {
        return parentType==='array' ? (childIndex===null ? `#${parentId}.${parentName}.push(${value});` : `#${parentId}.${parentName}[${childIndex}] = ${value};`)
            : parentType==='thing' ? `#${parentId}.${childName} = ${value};`
                : parentType==='set' ? `#${parentId}.${parentName}.add(${value});`
                    : '';
    };

    const buildQueryRemove = (parentName, parentId, childName, childIndex, childId, parentIsSet) => {
        return childIndex == null ? `#${parentId}.del('${childName}');`
            : parentIsSet ? `#${parentId}.${parentName}.remove(#${parentId}.${parentName}.find(|s| (s.id()==${childId}) ));`
                : `#${parentId}.${parentName}.splice(${childIndex}, 1);`; //childname or prentname???
    };

    return(
        <React.Fragment>
            {showQuery ? (
                <TextField
                    margin="dense"
                    name="queryString"
                    label="Query"
                    type="text"
                    value={query}
                    fullWidth
                    multiline
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
    cb: PropTypes.func.isRequired,
    child: PropTypes.object.isRequired,
    customTypes: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    showQuery: PropTypes.bool.isRequired,

};

export default BuildQueryString;