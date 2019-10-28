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
                v = makeTypeInstanceInit(childName, childType, customTypes, childVal);
                val = buildInput(v, childType);
            } else {
                val = buildInput(childVal, childType);
            }
            q = buildQueryAdd(parentId, childName, parentName, val, parentType, childIndex);
            break;
        // case 'edit':
        //     val = buildInput(childVal, childType);
        //     q = buildQueryEdit(parentId,  childName, parentName, val, parentType, childIndex);
        //     break;
        case 'remove':
            q = buildQueryRemove(parentName, parentId, childName, childIndex, childId);
            break;
        }
        setQuery(q);
    };


    const standardType = (name, type, customTypes, childVal) => {
        const v = childVal[name]||'';
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
            return(`{${makeTypeInstanceInit(name, type.substring(1,type.length-1), customTypes, childVal)}}`);
        case type.includes('['):
            return(`[${makeTypeInstanceInit(name, type.substring(1,type.length-1), customTypes, childVal)}]`);
        default:
            return '';
        }

    };

    const makeTypeInstanceInit = (name, type, customTypes, val) => customTypes[type] ?
        `${type}{${Object.entries(customTypes[type]).map(([k, t]) =>`${k}: ${makeTypeInstanceInit(k, t, customTypes, val)}` )}}`
        : standardType(name, type, customTypes, val);

    const buildInput = (input, type) => {
        return type === 'array' ? `[${input}]`
            : type == 'object' ? '{}'
                : type == 'string' ? `'${input}'`
                    : type == 'number' || type == 'boolean' ? `${input}`
                        : type == 'set' ? 'set({})'
                            : type == 'nil' ? 'nil'
                                : type == 'blob' ? 'blob'
                                    : type == 'closure' ? input
                                        : input != '' ? input
                                            : '';
    };

    const buildQueryAdd = (id, childName, parentName, value, type, index) => {
        return type==='array' ? (index===null ? `#${id}.${parentName}.push(${value});` : `#${id}.${parentName}[${index}] = ${value};`)
            : type==='object' ? `#${id}.${childName} = ${value};`
                : type==='set' ? `#${id}.${parentName}.add(${value});`
                    : '';
    };

    // const buildQueryEdit = (id,  childName, parentName, value, type, index) => {
    //     return type==='array' ? `#${id}.${parentName}[${index}] = ${value};`
    //         : type==='object' ? `#${id}.${childName} = ${value};`
    //             : '';
    // };

    const buildQueryRemove = (parentName, parentId, childName, index, id) => {
        return index == null ? `#${parentId}.del('${childName}');`
            : childName == '$' ? `#${parentId}.${parentName}.remove(#${parentId}.${parentName}.find(|s| (s.id()==${id}) ));`
                : `#${parentId}.${childName}.splice(${index}, 1);`; //childname or prentname???
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