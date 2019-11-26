import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const BuildQueryString = ({action, cb, child, customTypes, parent, showQuery, query}) => {

    React.useEffect(() => {
        handleBuildQuery(action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type);
    }, [action, child.val, child.type, child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    const handleBuildQuery = (action, childVal, childType, childIndex, childId, childName, parentId, parentName, parentType) => {
        let val;
        let q = '';
        switch (action) {
        case 'edit':
            if (customTypes.hasOwnProperty(childType)) { // incase of custom-type
                val = customTypeInput(childName, childType, customTypes, childVal);
            } else {
                val = standardInput(childVal, childType);
            }
            q = buildQueryAdd(parentId, parentName, parentType, childName, childIndex, val);
            break;
        case 'remove':
            q = buildQueryRemove(parentId, parentName, parentType, childId, childName, childIndex);
            break;
        }
        cb(q);
    };


    const mapArrayInput = (n, t, customTypes, value) => {
        const v = Array.isArray(value) ?
            value.map((v, i) => customTypeInput(name, v.type, customTypes, v))
            : customTypeInput(name, t.substring(1,t.length-1), customTypes, value);
        return v;
    };

    const createArrayInput = (name, type, customTypes, val) => `[${mapArrayInput(name, type, customTypes, val)}]`;

    //TODO add raw
    const setTypeInput = (n, t, customTypes, val) => {
        const v = val&&val.hasOwnProperty('val') ? val.val : val||'';
        return t.includes('str') || t.includes('utf8') ? `'${v}'`
            : t.includes('number') || t.includes('int') || t.includes('uint') || t.includes('float') || t.includes('bool') ? `${v}`
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

    //TODO add raw
    const standardInput = (childVal, childType) => {
        return childType === 'list' ? `[${childVal}]`
            : childType == 'thing' ? '{}'
                : childType == 'str'|| childType == 'utf8' ? `'${childVal}'`
                    : childType == 'number' || childType == 'bool' || childType == 'int'|| childType == 'uint'|| childType == 'float' ? `${childVal}`
                        : childType == 'set' ? 'set({})'
                            : childType == 'nil' ? 'nil'
                                : childType == 'bytes' ? 'blob'
                                    : childType == 'closure' ? childVal
                                        :childType == 'regex' ? childVal
                                            : childType == 'error' ? `err(${childVal.error_code}, '${childVal.error_msg}')`
                                                : '';
    };

    const buildQueryAdd = (parentId, parentName, parentType, childName, childIndex, value) => {
        return parentType==='list' ? (childIndex===null ? `#${parentId}.${parentName}.push(${value});` : `#${parentId}.${parentName}[${childIndex}] = ${value};`)
            : parentType==='thing' ? `#${parentId}.${childName} = ${value};`
                : parentType==='set' ? `#${parentId}.${parentName}.add(${value});`
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
};

BuildQueryString.propTypes = {
    action: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    child: PropTypes.object.isRequired,
    customTypes: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    showQuery: PropTypes.bool.isRequired,
    query: PropTypes.string,

};

export default BuildQueryString;