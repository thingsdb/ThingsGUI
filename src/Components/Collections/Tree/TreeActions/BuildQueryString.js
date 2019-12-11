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
                val = customTypeInput(childName, childType, customTypes, childVal&&childVal.hasOwnProperty('val') ? childVal.val : childVal);
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

    //CUSTOM\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    const mapArrayInput = (customTypes, v) => {
        return `[${v.map(({name, type, val}) => customTypeInput(name, type, customTypes, val))}]`;
    };

    const createArrayInput = (name, type, customTypes, val) => {
        return typeof(val)=='string' ? val
            : Array.isArray(val) && val.length ? mapArrayInput(customTypes, val)
                : customTypeInput(name, type.slice(1, -1), customTypes, val);
    };

    const createSetInput = (name, type, customTypes, val) => `set(${val==''? '{}': createArrayInput(name, type, customTypes, val)})`;

    // //TODO add raw and bytes
    // const setTypeInput = (name, type, customTypes, v) =>
    //     type[0]=='['? createArrayInput(name, type, customTypes, v)
    //         : type[0]=='{'? createSetInput(name, type, customTypes, v)
    //             : type.includes('str') || type.includes('utf8') || type.includes('raw') ? `'${v}'`
    //                 : type.includes('thing') || type.includes('number') || type.includes('int') || type.includes('uint') || type.includes('float') || type.includes('bool') ? `${v}`
    //                     : '';

    //TODO add raw and bytes
    const setTypeInput = (name, type, customTypes, v) =>
        type[0]=='['? createArrayInput(name, type, customTypes, v)
            : type[0]=='{'? createSetInput(name, type, customTypes, v)
                : type.includes('str') || type.includes('utf8') || type.includes('raw') ? `'${v}'`
                    : `${v}`;

    const mapTypeInput = (v, customTypes) => v.map(({name, type, val}) => `${name}: ${customTypeInput(name, type, customTypes, val)}`);

    const customTypeInput = (name, type, customTypes, val) =>
        customTypes[type.slice(-1)=='?'?type.slice(0, -1):type] ? `${type.slice(-1)=='?'?type.slice(0, -1):type}{${Array.isArray(val)&&val.length?mapTypeInput(val, customTypes):''}}`
            : setTypeInput(name, type, customTypes, val);

    //STANDARD\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // TODO add raw
    const standardInput = (childVal, childType) => {
        return childType == 'str' || childType == 'utf8' || childType == 'raw' ? `'${childVal}'`
            : childType == 'set' ? 'set({})'
                : childType == 'nil' ? 'nil'
                    : childType == 'bytes' ? 'blob'
                        : `${childVal}`;
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