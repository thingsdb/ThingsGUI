import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const BuildQueryString = ({action, cb, child, customTypes, parent, showQuery}) => {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        handleBuildQuery(action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type);
    }, [action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    React.useEffect(() => {
        cb(query);
    }, [query]);


    const handleBuildQuery = (action, childVal, childType, childIndex, childId, childName, parentId, parentName, parentType) => {
        let val;
        let v;
        let q = '';
        switch (action) {
        case 'edit':
            if (customTypes.hasOwnProperty(childType)) { // incase of custom-type
                v = createTypeInput(childName, childType, customTypes, childVal);
                val = buildInput(v, childType);
            } else {
                val = buildInput(childVal, childType);
            }
            q = buildQueryAdd(parentId, childName, parentName, val, parentType, childIndex);
            break;
        case 'remove':
            q = buildQueryRemove(parentName, parentId, childName, childIndex, childId);
            break;
        }
        setQuery(q);
    };


    const setTypeInput = (name, type, customTypes, childVal) => {
        const v = childVal||'';
        switch (true) {
        case type.includes('str'):
            return(`'${v}'`);
        case type.includes('int'):
            return(`${v}`);
        case type.includes('float'):
            return(`${v}`);
        case type.includes('bool'):
            return(`${v}`);
        case type.includes('thing'):
            return(`{${createTypeInput(name, type, customTypes, childVal)}}`);
        case type.includes('['):
            return(`[${createTypeInput(name, type.substring(1,type.length-1), customTypes, childVal)}]`);
        case type.includes('{'):
            return(`{${createTypeInput(name, type.substring(1,type.length-1), customTypes, childVal)}}`);
        default:
            return '';
        }
    };

    const mapTypeInput = (nam, typ, customTypes, val) => Object.entries(customTypes[typ]).map(([k, t]) => {
        const v = val&&val.val||val;
        const value = Array.isArray(v)&&v.length ? v.find( ({ name, type }) => name === k && type === t) : v;
        return ` ${k}: ${createTypeInput(k, t, customTypes, value&&value.val)}`;
    });

    const createTypeInput = (name, type, customTypes, val) => customTypes[type] ?
        `${type}{${mapTypeInput(name, type, customTypes, val)}}` : setTypeInput(name, type, customTypes, val);

    const buildInput = (childVal, childType) => {
        return childType === 'array' ? `[${childVal}]`
            : childType == 'thing' ? '{}'
                : childType == 'string' ? `'${childVal}'`
                    : childType == 'number' || childType == 'boolean' ? `${childVal}`
                        : childType == 'set' ? 'set({})'
                            : childType == 'nil' ? 'nil'
                                : childType == 'blob' ? 'blob'
                                    : childType == 'closure' ? childVal
                                        : childVal != '' ? childVal
                                            : '';
    };

    const buildQueryAdd = (parentId, childName, parentName, value, parentType, childIndex) => {
        return parentType==='array' ? (childIndex===null ? `#${parentId}.${parentName}.push(${value});` : `#${parentId}.${parentName}[${childIndex}] = ${value};`)
            : parentType==='thing' ? `#${parentId}.${childName} = ${value};`
                : parentType==='set' ? `#${parentId}.${parentName}.add(${value});`
                    : '';
    };

    const buildQueryRemove = (parentName, parentId, childName, childIndex, childId) => {
        return childIndex == null ? `#${parentId}.del('${childName}');`
            : childName == '$' ? `#${parentId}.${parentName}.remove(#${parentId}.${parentName}.find(|s| (s.id()==${childId}) ));`
                : `#${parentId}.${childName}.splice(${childIndex}, 1);`; //childname or prentname???
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