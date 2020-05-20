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

const CollectionEnumsTypes = ({categoryInit, enums, scope, customTypes}) => {
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
    const [category, setCategory] = React.useState(categoryInit);

    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);
        EnumActions.getEnums(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        category=='type'? TypeActions.getTypes(scope, tag) : EnumActions.getEnums(scope, tag);
    };

    const handleChangeType = (n) => () => {
        setName(n);
        setCategory('type');
    };
    const handleChangeCat = (n, c) => () => {
        setName(n);
        setCategory(c);
    };
    const handleClickEdit = (n, c) => () => {
        setName(n);
        setCategory(c);
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
        category ?
            TypeActions.deleteType(
                scope,
                n,
                tag,
                () => {
                    cb();
                }
            ) :
                EnumActions.deleteEnum(
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
            onClick: handleClickEdit(n, categoryInit),
        },
    ]);

    const customType = name&&customTypes[scope]?customTypes[scope].find(i=>i.name==name):{};
    console.log(customType, customTypes, category, name)
    const enum_ = name&&enums[scope]?enums[scope].find(i=>i.name==name):{};
    const rows  =  category=='type' ? customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyObject: <AddLink name={c[1]} scope={scope} onChange={handleChangeCat} />, propertyVal: ''})):[] : enum_.members? enum_.members.map(c=>({propertyName: c[0], propertyType: '', propertyObject: c[1], propertyVal: c[1]})):[];

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={categoryInit=='type'?customTypes[scope]:enums[scope]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title={categoryInit=='type'?'custom types':'enums'}
            />
            <AddDialog
                dataTypes={datatypesMap}
                category={categoryInit}
                getInfo={categoryInit=='type'?TypeActions.getTypes:EnumActions.getEnums}
                link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
                onClose={handleCloseAdd}
                open={add}
                scope={scope}
            />
            <EditDialog
                dataTypes={datatypesMap}
                category={category}
                getInfo={category=='type'?TypeActions.getTypes:EnumActions.getEnums}
                item={category=='type'?customType:enum_}
                link={`https://docs.thingsdb.net/v0/data-types/${category}/`}
                onChangeItem={handleChangeType}
                onClose={handleCloseEdit}
                open={edit}
                rows={rows}
                scope={scope}
            />
        </React.Fragment>
    );
};

CollectionEnumsTypes.propTypes = {
    scope: PropTypes.string.isRequired,
    categoryInit: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,

    /* enum properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(CollectionEnumsTypes);