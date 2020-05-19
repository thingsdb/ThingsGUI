import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {ChipsCard} from '../../Util';
import {CollectionTypesTAG} from '../../../constants';
import {EnumActions, EnumStore, TypeActions, TypeStore} from '../../../Stores';
import {AddDialog, AddLink, EditDialog} from '../CollectionsUtils/TypesEnumsUtils';


const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = CollectionTypesTAG;

const CollectionTypes = ({enums, scope, customTypes}) => {
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
        ...(customTypes[scope]||[]).map(c=>c.name)
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


    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
    });
    const {add, edit} = open;

    const [name, setName] = React.useState('');
    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        TypeActions.getTypes(scope, tag);
    };

    const handleChangeType = (n) => () => {
        setName(n);
    };
    const handleClickEdit = (n) => () => {
        setName(n);
        setOpen({...open, edit: true});
    };
    const handleCloseEdit = () => {
        setOpen({...open, edit: false});
    };

    const handleClickAdd = () => {
        setName('');
        setOpen({...open, add: true});
    };
    const handleCloseAdd = () => {
        setOpen({...open, add: false});
    };
    const handleClickDelete = (n, cb, tag) => {
        TypeActions.deleteType(
            scope,
            n,
            tag,
            () => {
                cb();
            }
        );
    };

    const buttons = (n)=>([
        {
            icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
            onClick: handleClickEdit(n),
        },
    ]);

    const typeEnumNames=[...(customTypes[scope]||[]).map(c=>c.name), ...(enums[scope]||[]).map(c=>(c.name))];
    const customType = name&&customTypes[scope]?customTypes[scope].find(i=>i.name==name):null;
    const enum_ = name&&enums[scope]?enums[scope].find(i=>i.name==name):null;
    const rows  =  customType ? customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyObject: <AddLink name={c[1]} items={typeEnumNames} onChange={handleChangeType} />, propertyVal: ''})):[] : enum_&&enum_.members? enum_.members.map(c=>({propertyName: c[0], propertyType: '', propertyObject: c[1], propertyVal: c[1]})):[];
    const usedBy = customTypes[scope]?customTypes[scope].filter(i=>
        `${i.fields},`.includes(`,${name},`) ||
        `${i.fields}`.includes(`,${name},`) ||
        `${i.fields}`.includes(`[${name}]`) ||
        `${i.fields}`.includes(`{${name}}`) ||
        `${i.fields}`.includes(`,${name}?`) ||
        `${i.fields}`.includes(`[${name}?]`) ||
        `${i.fields}`.includes(`{${name}?}`)
    ):[];

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={customTypes[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title="custom types"
            />
            <AddDialog
                dataTypes={datatypesMap}
                feature="type"
                getInfo={(scope, tag)=>TypeActions.getTypes(scope, tag)}
                link="https://docs.thingsdb.net/v0/data-types/type/"
                onClose={handleCloseAdd}
                open={add}
                scope={scope}
            />
            <EditDialog
                dataTypes={datatypesMap}
                feature={customType?'type':'enum'}
                getInfo={customType?(scope, tag)=>TypeActions.getTypes(scope, tag):(scope, tag)=>EnumActions.getEnums(scope, tag)}
                item={customType||enum_||{}}
                link="https://docs.thingsdb.net/v0/data-types/type/"
                onChangeItem={handleChangeType}
                onClose={handleCloseEdit}
                open={edit}
                rows={rows}
                scope={scope}
                usedBy={usedBy}
            />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,

    /* enum properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(CollectionTypes);