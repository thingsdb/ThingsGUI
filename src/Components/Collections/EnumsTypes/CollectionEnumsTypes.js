import {withVlow} from 'vlow';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import React from 'react';

import {CollectionTypesTAG} from '../../../constants';
import {EnumActions, EnumStore, TypeActions, TypeStore} from '../../../Stores';
import {AddLink, EnumTypeChips} from '../CollectionsUtils/TypesEnumsUtils';
import {DownloadBlob} from '../../Util';


const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = CollectionTypesTAG;

const headers = {
    type: {
        Fields: [
            {ky: 'default', label: 'Default'},
            {ky: 'propertyName', label: 'Name'},
            {ky: 'propertyObject', label: 'Type'},
        ],
        Methods: [
            {ky: 'propertyName', label: 'Name'},
            {ky: 'definition', label: 'Definition'},
        ]
    },
    enum: {
        Members: [
            {ky: 'default', label: 'Default'},
            {ky: 'propertyName', label: 'Name'},
            {ky: 'propertyObject', label: 'Value'},
        ]
    }
};

const queries = {
    add: {
        type: (name, list) => ({
            Fields: `set_type("${name}", {${list.map(v=>`${v.propertyName}: '${v.propertyType}'`)}})` ,
            Methods: `set_type("${name}", {${list.map(v=>`${v.propertyName}: '${v.definition}'`)}})` ,
        }),
        enum: (name, list) => `set_enum("${name}", {${list.map(v=>`${v.propertyName}: ${v.propertyVal}`)}})`
    },
    mod: {
        add: {
            type: (name, update) => ({
                Fields: `mod_type('${name}', 'add', '${update.propertyName}', '${update.propertyType}'${update.propertyVal?`, ${update.propertyVal}`:''})`,
                Methods: `mod_type('${name}', 'add', '${update.propertyName}', '${update.definition}')`,
            }),
            enum: (name, update) => `mod_enum('${name}', 'add', '${update.propertyName}', '${update.propertyVal}')`
        },
        mod: {
            type: (name, update) => ({
                Fields: `mod_type('${name}', 'mod', '${update.propertyName}', '${update.propertyType}'`,
                Methods: `mod_type('${name}', 'mod', '${update.propertyName}', '${update.definition}'`,
            }),
            enum: (name, update) => `mod_enum('${name}', 'mod', '${update.propertyName}', ${update.propertyVal})`
        },
        ren: {
            type: (name, oldname, newname) => `mod_type('${name}', 'ren', '${oldname}', '${newname}')`,
            enum: (name, oldname, newname) => `mod_enum('${name}', 'ren', '${oldname}', '${newname}')`
        },
        def: {
            enum: (name, update) => `mod_enum('${name}', 'def', '${update.propertyName}')`
        },
        del: {
            type: (name, update) => `mod_type('${name}', 'del', '${update.propertyName}')`,
            enum: (name, update) => `mod_enum('${name}', 'del', '${update.propertyName}')`
        },
    }
};

const CollectionEnumsTypes = ({scope, customTypes, enums}) => {
    const types = [
        'str',
        'utf8',
        'raw',
        'bytes',
        'bool',
        'int',
        'pint',
        'nint',
        'uint',
        'float',
        'number',
        'thing',
        'any',
        ...(customTypes[scope]||[]).map(c=>c.name),
        ...(enums[scope]||[]).map(c=>c.name)
    ];

    const typesOptional = [
        ...types,
        ...types.map(v=>`${v}?`),
    ];

    const list = [
        '[]',
        ...typesOptional.map(v=>`[${v}]`),
    ];

    const listOptional = [
        ...list,
        ...list.map(v=>`${v}?`),
    ];

    const set = [
        '{}',
        '{any}',
        '{thing}',
        ...(customTypes[scope]||[]).map(c=>`{${c.name}}`),
    ];

    const datatypesMap = [
        ...typesOptional,
        ...listOptional,
        ...set
    ];


    const [viewType, setViewType] = React.useState({
        add: false,
        edit: false,
        name: '',
        view: false,
    });
    const [viewEnum, setViewEnum] = React.useState({
        add: false,
        edit: false,
        name: '',
        view:false,
    });

    const handleChange = (a) => (n, c) => {
        if (c=='type') {
            setViewEnum({...viewEnum, [a]: false, name: ''});
            setViewType({...viewType, [a]: true, name: n});
        } else {
            setViewType({...viewType, [a]: false, name: ''});
            setViewEnum({...viewEnum, [a]: true, name: n});
        }

    };

    const handleClose = (a, c) => {
        if (c=='type') {
            setViewType({...viewType, [a]: false, name: ''});
        } else {
            setViewEnum({...viewEnum, [a]: false, name: ''});
        }
    };

    const rows = (view, noLink, categoryInit, fields) => {
        const item = view.name&&items?items.find(i=>i.name==view.name):{};
        const obj = item[fields] ? item[fields].map(([n,v])=>{
            const isBlob = v.constructor===String&&v.includes('/download/tmp/thingsdb-cache');
            const objectProof = !isBlob&&v.constructor===Object?JSON.stringify(v):v;
            const obj = isBlob? <DownloadBlob val={v} /> : noLink ? objectProof : <AddLink name={objectProof} scope={scope} onChange={view.view?handleChange('view'):handleChange('edit')} />;
            return({
                default: item.default===n? <CheckIcon />: null,
                propertyName: n,
                propertyType: categoryInit==='type'?v:'',
                propertyVal: categoryInit==='type'?'':v,
                propertyObject: obj,
            });
        }):[];

        return({
            Members: item[fields] ? obj :[],
            Fields: item[fields] ? obj :[],
            Methods: Object.entries(item.methods||{}).reduce((res, k) => {res.push({propertyName: k[0], definition: k[1].definition}); return res;},[])
        });
    }


    return (
        <React.Fragment>
            <EnumTypeChips
                buttonsView={{add: true, edit: true, run: false, view: false}}
                categoryInit="type"
                datatypes={datatypesMap}
                headers={headers.type}
                onChange={handleChange}
                onClose={handleClose}
                onDelete={TypeActions.deleteType}
                onInfo={TypeActions.getTypes}
                rows={rows(viewType, false, 'type', 'fields')}
                scope={scope}
                tag={tag}
                view={viewType}
                queries={queries}
            />
            <EnumTypeChips
                buttonsView={{add: true, edit: true, run: false, view: false}}
                categoryInit="enum"
                headers={headers.enum}
                onChange={handleChange}
                onClose={handleClose}
                onDelete={EnumActions.deleteEnum}
                onInfo={EnumActions.getEnums}
                rows={rows(viewEnum, true, 'enum', 'members')}
                scope={scope}
                tag={tag}
                view={viewEnum}
                queries={queries}
            />
        </React.Fragment>
    );
};

CollectionEnumsTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(CollectionEnumsTypes);